// src/lib/apiClient.js
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export function getApiBaseUrl() {
  return baseUrl?.replace(/\/$/, "") || null;
}

export async function apiFetch(path, options = {}) {
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    console.error("Missing VITE_API_BASE_URL. Set it in Vercel env for velodoctor-admin.");
    // => retourne une erreur propre au lieu de casser le rendu
    return { ok: false, status: 0, data: null, error: "Missing API base URL" };
  }

  const url = `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;

  let res;
  try {
    res = await fetch(url, options);
  } catch (e) {
    return { ok: false, status: 0, data: null, error: String(e) };
  }

  let data = null;
  try { data = await res.json(); } catch {}
  return { ok: res.ok, status: res.status, data, error: res.ok ? null : (data?.error || "Request failed") };
}