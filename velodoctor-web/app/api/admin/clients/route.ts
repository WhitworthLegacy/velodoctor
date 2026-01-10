import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';

export async function GET(request: Request) {
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
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }

  return NextResponse.json({ clients: data || [] });
}

export async function POST(request: Request) {
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
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }

  return NextResponse.json({ client: data });
}
