import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from('appointments')
    .select('id, scheduled_at, service_type, status')
    .eq('client_id', params.id)
    .order('scheduled_at', { ascending: false });

  if (error) {
    console.error('[admin] client appointments failed:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }

  return NextResponse.json({ appointments: data || [] });
}
