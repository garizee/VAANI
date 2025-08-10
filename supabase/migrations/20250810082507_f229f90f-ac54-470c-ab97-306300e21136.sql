-- Create tickets table with image support
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  category TEXT NOT NULL,
  location TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  image_url TEXT,
  resolution_image_url TEXT,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tickets table
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tickets
CREATE POLICY "Users can view all tickets" 
ON public.tickets 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own tickets" 
ON public.tickets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" 
ON public.tickets 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete their own tickets" 
ON public.tickets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for ticket images
INSERT INTO storage.buckets (id, name, public) VALUES ('ticket-images', 'ticket-images', true);

-- Create RLS policies for ticket images storage
CREATE POLICY "Users can upload ticket images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ticket-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view ticket images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ticket-images');

CREATE POLICY "Users can update their ticket images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'ticket-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their ticket images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'ticket-images' AND auth.uid() IS NOT NULL);

-- Create trigger for updating timestamps
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();