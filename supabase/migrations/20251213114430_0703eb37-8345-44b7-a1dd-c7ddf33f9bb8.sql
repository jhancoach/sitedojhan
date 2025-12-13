-- Create table for saving rosters
CREATE TABLE public.elencos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  coach JSONB DEFAULT NULL,
  titulares JSONB NOT NULL DEFAULT '[]'::jsonb,
  reservas JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.elencos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own rosters" 
ON public.elencos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rosters" 
ON public.elencos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rosters" 
ON public.elencos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rosters" 
ON public.elencos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_elencos_updated_at
BEFORE UPDATE ON public.elencos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();