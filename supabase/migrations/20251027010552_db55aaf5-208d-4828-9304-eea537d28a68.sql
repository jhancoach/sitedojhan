-- Create profiles table for authenticated users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  apelido TEXT,
  email TEXT NOT NULL,
  funcao_ff TEXT NOT NULL,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create free_agents table
CREATE TABLE public.free_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  foto_url TEXT NOT NULL,
  ano_nascimento INTEGER NOT NULL,
  funcao TEXT NOT NULL CHECK (funcao IN ('Coach', 'Analista', 'Manager', 'Rush 1', 'Rush 2', 'Sniper', 'Granadeiro', 'Coringa')),
  capitao BOOLEAN NOT NULL DEFAULT false,
  hud_dedos TEXT,
  instagram TEXT NOT NULL,
  youtube TEXT,
  referencias TEXT,
  habilidades TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.free_agents ENABLE ROW LEVEL SECURITY;

-- Free agents policies
CREATE POLICY "Anyone can view free agents"
  ON public.free_agents FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own free agent profile"
  ON public.free_agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own free agent profile"
  ON public.free_agents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own free agent profile"
  ON public.free_agents FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_free_agents_updated_at
  BEFORE UPDATE ON public.free_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, sobrenome, apelido, email, funcao_ff)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    COALESCE(NEW.raw_user_meta_data->>'sobrenome', ''),
    NEW.raw_user_meta_data->>'apelido',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'funcao_ff', 'Jogador')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();