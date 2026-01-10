import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';
import { applyCors } from '@/lib/cors';

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function GET(
  request: NextRequest,
  ctx: { params: { id: string } }
) {
  const { id } = ctx.params;
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { searchParams } = new URL(request.url);
  const includeCancelled = searchParams.get('include_cancelled') === 'true';

  let query = auth.supabase
    .from('appointments')
    .select('id, scheduled_at, service_type, status')
    .eq('client_id', id)
    .order('scheduled_at', { ascending: false });

  if (!includeCancelled) {
    query = query.neq('status', 'cancelled');
  }

  const { data, error } = await query;

  if (error) {
    console.error('[admin] client appointments failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ appointments: data || [] }));
}
