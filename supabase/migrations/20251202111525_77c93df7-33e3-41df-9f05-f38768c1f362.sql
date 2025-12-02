-- Criar tabela para salvar projetos de mapeamento
CREATE TABLE public.mapeamento_projetos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  mapa_nome TEXT NOT NULL,
  itens JSONB NOT NULL DEFAULT '[]'::jsonb,
  anotacoes JSONB NOT NULL DEFAULT '[]'::jsonb,
  desenhos JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mapeamento_projetos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuários podem ver seus próprios projetos"
ON public.mapeamento_projetos
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios projetos"
ON public.mapeamento_projetos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios projetos"
ON public.mapeamento_projetos
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios projetos"
ON public.mapeamento_projetos
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_mapeamento_projetos_updated_at
BEFORE UPDATE ON public.mapeamento_projetos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();