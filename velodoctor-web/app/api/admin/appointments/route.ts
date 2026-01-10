import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let query = auth.supabase
    .from('appointments')
    .select('*, clients(id, full_name, email, phone, address), vehicles(brand, model, type)')
    .order('scheduled_at', { ascending: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[admin] appointments list failed:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }

  return NextResponse.json({ appointments: data || [] });
}
