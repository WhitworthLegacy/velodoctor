import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';
import { applyCors } from '@/lib/cors';

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from('clients')
    .select('*')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('[admin] clients list failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ clients: data || [] }));
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));
  const { data, error } = await auth.supabase
    .from('clients')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    console.error('[admin] client create failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to create client' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ client: data }));
}
