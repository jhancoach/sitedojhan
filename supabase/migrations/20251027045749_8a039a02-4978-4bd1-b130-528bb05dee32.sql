-- Adiciona a coluna nick primeiro sem constraint
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nick TEXT;

-- Migra dados existentes: usa apelido como nick, ou concatena nome+sobrenome se não tiver apelido
UPDATE public.profiles 
SET nick = COALESCE(
  apelido,
  CASE 
    WHEN nome IS NOT NULL AND sobrenome IS NOT NULL THEN CONCAT(nome, ' ', sobrenome)
    WHEN nome IS NOT NULL THEN nome
    ELSE 'Player'
  END
)
WHERE nick IS NULL;

-- Agora remove as colunas antigas
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS nome,
DROP COLUMN IF EXISTS sobrenome;

-- Adiciona NOT NULL constraint no nick
ALTER TABLE public.profiles
ALTER COLUMN nick SET NOT NULL;

-- Remove as constraints antigas de nome e sobrenome
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_nome_length,
DROP CONSTRAINT IF EXISTS profiles_sobrenome_length;

-- Adiciona constraint para o nick
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_nick_length CHECK (length(nick) >= 3 AND length(nick) <= 50);

-- Atualiza o trigger para usar nick ao invés de nome/sobrenome
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, nick, apelido, funcao_ff, instagram)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nick', NEW.raw_user_meta_data->>'apelido', 'Player'),
    NEW.raw_user_meta_data->>'apelido',
    COALESCE(NEW.raw_user_meta_data->>'funcao_ff', 'Jogador'),
    COALESCE(NEW.raw_user_meta_data->>'instagram', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();