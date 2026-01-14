import { supabase, clearSupabaseAuthStorage } from './supabase';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export function getDataVersion() {
  if (typeof window === "undefined") return 0;
  return window.__adminDataVersion || 0;
}

export function bumpDataVersion() {
  if (typeof window === "undefined") return;
  window.__adminDataVersion = (window.__adminDataVersion || 0) + 1;
  window.dispatchEvent(new Event("admin-data-changed"));
}

export function getApiBaseUrl() {
  return baseUrl?.replace(/\/$/, "") || null;
}

export async function apiFetch(path, options = {}) {
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    console.error("Missing VITE_API_BASE_URL. Set it in Vercel env for velodoctor-admin.");
    throw new Error("Missing API base URL");
  }

  const method = (options.method || "GET").toUpperCase();
  const url = `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;
  const isDev = Boolean(import.meta.env.DEV);
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
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
    console.info('[apiFetch]', { url, hasAuth: Boolean(accessToken) });
  }

  if (method !== "GET") {
    bumpDataVersion();
  }

  let res;
  try {
    res = await fetch(url, { ...options, headers, signal: controller.signal });
  } catch (e) {
    if (isDev) {
      console.error('[apiFetch] network error', e);
    }
    if (e?.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }

  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      clearSupabaseAuthStorage();
      await supabase.auth.signOut();
    }
    if (isDev) {
      console.error('[apiFetch] request failed', { status: res.status, body: data });
    }
    const error = new Error(data?.error || data?.message || 'Request failed');
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  if (isDev) {
    console.info('[apiFetch] request ok', { status: res.status, url });
  }
  return data;
}
