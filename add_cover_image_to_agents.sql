-- Add cover_image_url column to agents table
ALTER TABLE public.agents
ADD COLUMN cover_image_url TEXT;
