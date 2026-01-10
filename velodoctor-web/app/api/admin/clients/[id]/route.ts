import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('[admin] client fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }

  return NextResponse.json({ client: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));
  const { data, error } = await auth.supabase
    .from('clients')
    .update(payload)
    .eq('id', params.id)
    .select('*')
    .single();

  if (error) {
    console.error('[admin] client update failed:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }

  return NextResponse.json({ client: data });
}
