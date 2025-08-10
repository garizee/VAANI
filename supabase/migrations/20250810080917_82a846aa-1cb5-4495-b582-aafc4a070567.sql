-- Create storage bucket for resolution images
INSERT INTO storage.buckets (id, name, public) VALUES ('ticket-resolutions', 'ticket-resolutions', true);

-- Add resolution tracking columns to tickets table
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS resolution_image_url TEXT;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS resolution_notes TEXT;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES public.profiles(user_id);

-- Create ticket analytics table for tracking improvements
CREATE TABLE IF NOT EXISTS public.ticket_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  resolution_time_hours INTEGER,
  resolved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ticket analytics
ALTER TABLE public.ticket_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ticket analytics
CREATE POLICY "Users can view all ticket analytics" ON public.ticket_analytics
FOR SELECT USING (true);

CREATE POLICY "System can insert ticket analytics" ON public.ticket_analytics
FOR INSERT WITH CHECK (true);

-- Create storage policies for resolution images
CREATE POLICY "Users can upload resolution images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'ticket-resolutions' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view resolution images" ON storage.objects
FOR SELECT USING (bucket_id = 'ticket-resolutions');

CREATE POLICY "Users can update their resolution images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'ticket-resolutions' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their resolution images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'ticket-resolutions' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Function to archive resolved tickets to analytics
CREATE OR REPLACE FUNCTION public.archive_resolved_ticket()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into analytics when ticket is resolved
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    INSERT INTO public.ticket_analytics (
      ticket_id,
      category,
      priority,
      resolution_time_hours,
      resolved_at
    ) VALUES (
      NEW.id,
      NEW.category,
      NEW.priority,
      EXTRACT(EPOCH FROM (NEW.updated_at - NEW.created_at)) / 3600,
      NEW.updated_at
    );
    
    -- Set resolved_at timestamp
    NEW.resolved_at = NEW.updated_at;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for archiving resolved tickets
DROP TRIGGER IF EXISTS archive_resolved_ticket_trigger ON public.tickets;
CREATE TRIGGER archive_resolved_ticket_trigger
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.archive_resolved_ticket();

-- Function to auto-delete resolved tickets after 2 days
CREATE OR REPLACE FUNCTION public.cleanup_old_resolved_tickets()
RETURNS void AS $$
BEGIN
  DELETE FROM public.tickets 
  WHERE status = 'resolved' 
    AND resolved_at IS NOT NULL 
    AND resolved_at < NOW() - INTERVAL '2 days';
END;
$$ LANGUAGE plpgsql;

-- Function to get ticket resolution analytics
CREATE OR REPLACE FUNCTION public.get_ticket_analytics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  date DATE,
  category TEXT,
  total_resolved INTEGER,
  avg_resolution_hours NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    resolved_at::DATE as date,
    ta.category,
    COUNT(*)::INTEGER as total_resolved,
    ROUND(AVG(ta.resolution_time_hours), 2) as avg_resolution_hours
  FROM public.ticket_analytics ta
  WHERE ta.resolved_at::DATE BETWEEN start_date AND end_date
  GROUP BY resolved_at::DATE, ta.category
  ORDER BY date DESC, category;
END;
$$ LANGUAGE plpgsql;

-- Function to get improvement metrics
CREATE OR REPLACE FUNCTION public.get_improvement_metrics()
RETURNS TABLE (
  metric_name TEXT,
  current_period NUMERIC,
  previous_period NUMERIC,
  improvement_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH current_stats AS (
    SELECT 
      COUNT(*) as total_resolved,
      AVG(resolution_time_hours) as avg_resolution_time
    FROM public.ticket_analytics 
    WHERE resolved_at >= CURRENT_DATE - INTERVAL '30 days'
  ),
  previous_stats AS (
    SELECT 
      COUNT(*) as total_resolved,
      AVG(resolution_time_hours) as avg_resolution_time
    FROM public.ticket_analytics 
    WHERE resolved_at >= CURRENT_DATE - INTERVAL '60 days'
      AND resolved_at < CURRENT_DATE - INTERVAL '30 days'
  )
  SELECT 
    'Total Resolved'::TEXT,
    c.total_resolved::NUMERIC,
    p.total_resolved::NUMERIC,
    CASE 
      WHEN p.total_resolved > 0 THEN 
        ROUND(((c.total_resolved - p.total_resolved) / p.total_resolved * 100), 2)
      ELSE 0
    END
  FROM current_stats c, previous_stats p
  
  UNION ALL
  
  SELECT 
    'Average Resolution Time (Hours)'::TEXT,
    c.avg_resolution_time,
    p.avg_resolution_time,
    CASE 
      WHEN p.avg_resolution_time > 0 THEN 
        ROUND(((p.avg_resolution_time - c.avg_resolution_time) / p.avg_resolution_time * 100), 2)
      ELSE 0
    END
  FROM current_stats c, previous_stats p;
END;
$$ LANGUAGE plpgsql;