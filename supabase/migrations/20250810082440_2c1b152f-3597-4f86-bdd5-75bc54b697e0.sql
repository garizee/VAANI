-- Add image_url column to tickets table
ALTER TABLE public.tickets ADD COLUMN image_url TEXT;

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