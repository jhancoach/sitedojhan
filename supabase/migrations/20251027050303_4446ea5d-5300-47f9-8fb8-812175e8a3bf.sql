-- Fix free_agents table: Remove public access and require authentication
DROP POLICY IF EXISTS "Anyone can view free agents" ON public.free_agents;

CREATE POLICY "Authenticated users can view free agents"
ON public.free_agents
FOR SELECT
USING (auth.role() = 'authenticated');

-- Fix user_roles table: Add UPDATE policy restricted to admins only
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));