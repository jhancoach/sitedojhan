-- Criar buckets de storage para imagens
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('safes', 'safes', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]),
  ('aerial-views', 'aerial-views', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]),
  ('maps', 'maps', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[])
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso público para visualização
CREATE POLICY "Public can view safes images"
ON storage.objects FOR SELECT
USING (bucket_id = 'safes');

CREATE POLICY "Public can view aerial views images"
ON storage.objects FOR SELECT
USING (bucket_id = 'aerial-views');

CREATE POLICY "Public can view maps images"
ON storage.objects FOR SELECT
USING (bucket_id = 'maps');

-- Políticas de upload (apenas usuários autenticados)
CREATE POLICY "Authenticated users can upload safes images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'safes' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload aerial views images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'aerial-views' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload maps images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'maps' AND
  auth.role() = 'authenticated'
);

-- Políticas de atualização/delete (apenas usuários autenticados)
CREATE POLICY "Authenticated users can update safes images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'safes' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete safes images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'safes' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update aerial views images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'aerial-views' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete aerial views images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'aerial-views' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update maps images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'maps' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete maps images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'maps' AND
  auth.role() = 'authenticated'
);