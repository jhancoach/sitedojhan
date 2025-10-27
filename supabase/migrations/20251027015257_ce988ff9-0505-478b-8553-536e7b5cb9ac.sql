-- Restringir acesso aos perfis para proteger dados pessoais (emails)
-- Usuários só podem ver seu próprio perfil completo

-- Remover política antiga que permite ver todos os perfis
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Nova política: usuários só podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);