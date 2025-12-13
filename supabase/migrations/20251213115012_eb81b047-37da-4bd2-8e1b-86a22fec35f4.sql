-- Add logo_url and team_name columns to elencos table
ALTER TABLE public.elencos 
ADD COLUMN logo_url TEXT DEFAULT NULL,
ADD COLUMN team_name TEXT DEFAULT NULL;