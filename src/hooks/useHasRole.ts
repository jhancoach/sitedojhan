import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useHasRole(role: 'admin' | 'user') {
  const { user } = useAuth();
  const [hasRole, setHasRole] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      if (!user) {
        setHasRole(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', role)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking role:', error);
          setHasRole(false);
        } else {
          setHasRole(!!data);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    }

    checkRole();
  }, [user, role]);

  return { hasRole, loading };
}
