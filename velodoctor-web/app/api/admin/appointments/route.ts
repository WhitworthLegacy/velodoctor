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

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const includeCancelled = searchParams.get('include_cancelled') === 'true';

  let query = auth.supabase
    .from('appointments')
    .select('*, clients(id, full_name, email, phone, address), vehicles(brand, model, type)')
    .order('scheduled_at', { ascending: true });

  if (status) {
    query = query.eq('status', status);
  } else if (!includeCancelled) {
    query = query.neq('status', 'cancelled');
  }

  const { data, error } = await query;

  if (error) {
    console.error('[admin] appointments list failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ appointments: data || [] }));
}
