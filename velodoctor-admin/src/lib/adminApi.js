import { ROLES } from './constants';
import { apiFetch } from './apiClient';

export async function fetchUserRole() {
  try {
    const payload = await apiFetch('/api/admin/me');
    return payload?.role || null;
  } catch (error) {
    console.warn('[adminApi] Unable to fetch role:', error);
    return null;
  }
}

export async function isAdminRole() {
  const role = await fetchUserRole();
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

export async function deleteAppointmentById(appointmentId) {
  return apiFetch(`/api/admin/appointments/${appointmentId}`, {
    method: 'DELETE',
  });
}
