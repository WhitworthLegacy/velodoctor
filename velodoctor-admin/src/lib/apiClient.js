// src/lib/apiClient.js
import { supabase } from './supabase';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const responseCache = new Map();

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
  const timeoutMs = options.timeoutMs ?? 10000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token || null;
  const headers = new Headers(options.headers || {});
  const cacheMs = options.cacheMs ?? 300000;
  const cacheKey = `${method}:${url}:${accessToken || "anon"}`;

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

  if (method !== "GET") {
    responseCache.clear();
  }

  if (method === "GET" && !options.noCache && cacheMs > 0) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheMs) {
      return cached.data;
    }
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
    if (isDev) {
      console.error('[apiFetch] request failed', { status: res.status, body: data });
    }
    const error = new Error(data?.error || data?.message || 'Request failed');
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  if (method === "GET" && !options.noCache && cacheMs > 0) {
    responseCache.set(cacheKey, { data, timestamp: Date.now() });
  }

  if (isDev) {
    console.info('[apiFetch] request ok', { status: res.status, url });
  }
  return data;
}
