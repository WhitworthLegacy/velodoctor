// src/lib/apiClient.js
import { supabase } from './supabase';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export function getApiBaseUrl() {
  return baseUrl?.replace(/\/$/, "") || null;
}

export async function apiFetch(path, options = {}) {
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    console.error("Missing VITE_API_BASE_URL. Set it in Vercel env for velodoctor-admin.");
    throw new Error("Missing API base URL");
  }

  const url = `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;
  const isDev = Boolean(import.meta.env.DEV);
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token || null;
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (isDev) {
    console.info('[apiFetch]', {
      baseUrl: apiBase,
      url,
      hasAuth: Boolean(accessToken),
    });
  }

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (e) {
    if (isDev) {
      console.error('[apiFetch] network error', e);
    }
    throw e;
  }

  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    if (isDev) {
      console.error('[apiFetch] request failed', { status: res.status, body: data });
    }
    const error = new Error(data?.error || data?.message || 'Request failed');
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  return data;
}
