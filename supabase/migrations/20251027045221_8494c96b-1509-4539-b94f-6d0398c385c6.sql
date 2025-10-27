-- First, normalize existing data in profiles table
UPDATE public.profiles SET funcao_ff = 'Analista' WHERE lower(funcao_ff) = 'analista';
UPDATE public.profiles SET funcao_ff = 'Coach' WHERE lower(funcao_ff) = 'coach';
UPDATE public.profiles SET funcao_ff = 'Jogador' WHERE lower(funcao_ff) = 'jogador';
UPDATE public.profiles SET funcao_ff = 'Treinador' WHERE lower(funcao_ff) = 'treinador';
UPDATE public.profiles SET funcao_ff = 'Gerente' WHERE lower(funcao_ff) = 'gerente';

-- Fix storage bucket policies to require admin role
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload safes images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update safes images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete safes images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload aerial views images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update aerial views images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete aerial views images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload maps images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update maps images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete maps images" ON storage.objects;

-- Create new admin-only policies for safes bucket
CREATE POLICY "Only admins can upload safes images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'safes' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can update safes images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'safes' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can delete safes images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'safes' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Create new admin-only policies for aerial-views bucket
CREATE POLICY "Only admins can upload aerial views images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'aerial-views' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can update aerial views images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'aerial-views' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can delete aerial views images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'aerial-views' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Create new admin-only policies for maps bucket
CREATE POLICY "Only admins can upload maps images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'maps' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can update maps images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'maps' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can delete maps images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'maps' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add CHECK constraints to profiles table for input validation
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_nome_length CHECK (length(nome) >= 1 AND length(nome) <= 100),
ADD CONSTRAINT profiles_sobrenome_length CHECK (length(sobrenome) >= 1 AND length(sobrenome) <= 100),
ADD CONSTRAINT profiles_apelido_length CHECK (apelido IS NULL OR (length(apelido) >= 3 AND length(apelido) <= 30)),
ADD CONSTRAINT profiles_funcao_ff_valid CHECK (funcao_ff IN ('Jogador', 'Treinador', 'Analista', 'Coach', 'Gerente', 'Outro'));

-- Add CHECK constraints to free_agents table for input validation
ALTER TABLE public.free_agents
ADD CONSTRAINT free_agents_nome_completo_length CHECK (length(nome_completo) >= 1 AND length(nome_completo) <= 100),
ADD CONSTRAINT free_agents_ano_nascimento_range CHECK (ano_nascimento >= 1950 AND ano_nascimento <= EXTRACT(YEAR FROM CURRENT_DATE)),
ADD CONSTRAINT free_agents_funcao_valid CHECK (funcao IN ('Fragger', 'Support', 'IGL', 'Rusher', 'Lurker')),
ADD CONSTRAINT free_agents_habilidades_length CHECK (habilidades IS NULL OR length(habilidades) <= 500),
ADD CONSTRAINT free_agents_referencias_length CHECK (referencias IS NULL OR length(referencias) <= 500),
ADD CONSTRAINT free_agents_hud_dedos_length CHECK (hud_dedos IS NULL OR length(hud_dedos) <= 100),
ADD CONSTRAINT free_agents_instagram_length CHECK (length(instagram) >= 1 AND length(instagram) <= 200),
ADD CONSTRAINT free_agents_youtube_length CHECK (youtube IS NULL OR length(youtube) <= 200);