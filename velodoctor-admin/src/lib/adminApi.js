import { supabase } from './supabase';
import { ROLES } from './constants';

export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export async function fetchUserRole() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {
    console.warn('[adminApi] Unable to read profile role:', error);
    return null;
  }

  return data?.role || null;
}

export async function isAdminRole() {
  const role = await fetchUserRole();
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

export async function deleteAppointmentById(appointmentId) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Missing auth token');
  }

  const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to delete appointment');
  }

  return payload;
}
