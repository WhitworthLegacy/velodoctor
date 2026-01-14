import { ROLES } from './constants';
import { apiFetch } from './apiClient';

export async function fetchUserRole() {
  const payload = await apiFetch('/api/admin/me');
  return payload?.role || null;
}

export async function isAdminRole() {
  try {
    const role = await fetchUserRole();
    return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
  } catch (error) {
    console.warn('[adminApi] Unable to fetch role:', error);
    return false;
  }
}

export async function deleteAppointmentById(appointmentId) {
  return apiFetch(`/api/admin/appointments/${appointmentId}`, {
    method: 'DELETE',
  });
}

export async function deleteClientById(clientId) {
  return apiFetch(`/api/admin/clients/${clientId}`, {
    method: 'DELETE',
  });
}
