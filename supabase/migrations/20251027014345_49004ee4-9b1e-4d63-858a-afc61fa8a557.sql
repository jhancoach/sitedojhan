-- Tornar o campo foto_url opcional na tabela free_agents
ALTER TABLE public.free_agents
ALTER COLUMN foto_url DROP NOT NULL;