import { useState, useEffect, useCallback } from 'react';
import { supabase, clearSupabaseAuthStorage } from '../supabase';
import { fetchUserRole } from '../adminApi';

const SESSION_TIMEOUT_MS = 15000;
const SAFETY_TIMEOUT_MS = 25000;

export function useAuth() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const resolveUserRole = useCallback(async () => {
    try {
      const role = await fetchUserRole();
      setUserRole(role || null);
      setError(null);
      return true;
    } catch (e) {
      console.error('[auth] role fetch failed', e);
      throw e;
    }
  }, []);

  const initSession = useCallback(async () => {
    setError(null);
    try {
      const { data: { session: currentSession } } = await Promise.race([
        supabase.auth.getSession(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session timeout')), SESSION_TIMEOUT_MS)
        ),
      ]);

      setSession(currentSession);

      if (currentSession) {
        await resolveUserRole();
      }

      setLoading(false);
    } catch (err) {
      console.error('[auth] session fetch failed', err);
      setError(err.message || 'Erreur de connexion');
      setLoading(false);
    }
  }, [resolveUserRole]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((c) => c + 1);
    initSession();
  }, [initSession]);

  const logout = useCallback(async () => {
    clearSupabaseAuthStorage();
    await supabase.auth.signOut();
    setSession(null);
    setUserRole(null);
  }, []);

  useEffect(() => {
    window.supabase = supabase;

    const safetyTimeout = setTimeout(async () => {
      if (loading) {
        console.warn('[auth] safety timeout triggered');
        setError('Délai de connexion dépassé');
        setLoading(false);
      }
    }, SAFETY_TIMEOUT_MS);

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        try {
          await resolveUserRole();
        } catch {
          setError('Impossible de récupérer votre rôle');
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [initSession, resolveUserRole]);

  return {
    session,
    userRole,
    loading,
    error,
    retry,
    logout,
    retryCount,
  };
}
