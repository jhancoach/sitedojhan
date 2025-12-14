-- Add notas column to elencos table
ALTER TABLE public.elencos 
ADD COLUMN notas TEXT DEFAULT NULL;