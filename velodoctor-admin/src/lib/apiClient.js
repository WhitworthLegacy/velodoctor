import { supabase } from './supabase';

const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export async function apiFetch(path, options = {}) {
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not set');
  }

  const token = await getAccessToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || 'API request failed');
  }

  return payload;
}
