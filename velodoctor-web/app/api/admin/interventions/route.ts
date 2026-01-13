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
    .from('interventions')
    .select('*, vehicles(id, brand, model, type, clients(id, full_name))')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] interventions failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to fetch interventions' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ interventions: data || [] }));
}
