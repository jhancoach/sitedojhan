import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * IMPORTANT: This hook is for UI RENDERING ONLY.
 * 
 * It should NOT be relied upon for security - actual authorization is enforced
 * server-side via RLS policies using the has_role() database function.
 * 
 * This hook queries the user_roles table to determine if the current user has
 * a specific role, allowing conditional UI rendering (e.g., showing admin links).
 * 
 * All sensitive operations MUST be protected by RLS policies - client-side
 * checks can be bypassed and should only be used to improve UX.
 */
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
          .maybeSingle();

        if (error) {
          // Log generic message - actual error details stay server-side
          console.warn('Unable to verify user role');
          setHasRole(false);
        } else {
          setHasRole(!!data);
        }
      } catch {
        // Log generic message without exposing error details
        console.warn('Unable to verify user role');
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    }

    checkRole();
  }, [user, role]);

  return { hasRole, loading };
}
