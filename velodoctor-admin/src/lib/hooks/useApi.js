import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const payload = await apiFetch('/api/admin/clients');
      return payload.clients || [];
    },
  });
}

export function useCrmColumns() {
  return useQuery({
    queryKey: ['crm-columns'],
    queryFn: async () => {
      const payload = await apiFetch('/api/admin/crm-columns');
      return payload.columns || [];
    },
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const payload = await apiFetch('/api/admin/appointments');
      return payload.appointments || [];
    },
  });
}

export function useInterventions() {
  return useQuery({
    queryKey: ['interventions'],
    queryFn: async () => {
      const payload = await apiFetch('/api/admin/interventions');
      return payload.interventions || [];
    },
  });
}

export function useInventoryItems() {
  return useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const payload = await apiFetch('/api/admin/inventory-items');
      return payload.items || [];
    },
  });
}

export function useClientAppointments(clientId) {
  return useQuery({
    queryKey: ['client-appointments', clientId],
    queryFn: async () => {
      const payload = await apiFetch(`/api/admin/clients/${clientId}/appointments`);
      return payload.appointments || [];
    },
    enabled: !!clientId,
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      return apiFetch(`/api/admin/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      return apiFetch('/api/admin/clients', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      return apiFetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['client-appointments'] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return apiFetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['client-appointments'] });
    },
  });
}

export function useUpdateIntervention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      return apiFetch(`/api/admin/interventions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      return apiFetch(`/api/admin/inventory-items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      return apiFetch('/api/admin/inventory-items', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return apiFetch(`/api/admin/clients/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useInvalidateAll() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries();
  };
}
