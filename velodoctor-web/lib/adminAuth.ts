import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { applyCors } from '@/lib/cors';

const ADMIN_ROLES = new Set(['admin', 'super_admin']);
const STAFF_ROLES = new Set(['admin', 'super_admin', 'manager', 'dispatch', 'tech', 'driver', 'support']);

async function requireRole(request: Request, allowedRoles: Set<string>) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return { error: applyCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 })) };
  }

  const supabase = getSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return { error: applyCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 })) };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profileError) {
    console.error('[admin] profile lookup failed:', profileError);
    return { error: applyCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 })) };
  }

  if (!allowedRoles.has(profile?.role)) {
    return { error: applyCors(NextResponse.json({ error: 'Forbidden' }, { status: 403 })) };
  }

  return { supabase, userId: userData.user.id, role: profile?.role };
}

export async function requireAdmin(request: Request) {
  return requireRole(request, ADMIN_ROLES);
}

export async function requireStaff(request: Request) {
  return requireRole(request, STAFF_ROLES);
}
