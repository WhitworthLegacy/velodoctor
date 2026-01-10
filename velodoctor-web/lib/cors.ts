import { NextResponse } from 'next/server';

const DEFAULT_HEADERS = 'authorization, content-type';
const DEFAULT_METHODS = 'GET,POST,PATCH,DELETE,OPTIONS';

export function getCorsHeaders() {
  const origin = process.env.ADMIN_ORIGIN || '*';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': DEFAULT_HEADERS,
    'Access-Control-Allow-Methods': DEFAULT_METHODS,
    'Access-Control-Max-Age': '86400',
  };
}

export function applyCors<T extends NextResponse>(response: T) {
  const headers = getCorsHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
