import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from('interventions')
    .select('*, vehicles(brand, model, clients(full_name))')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] interventions failed:', error);
    return NextResponse.json({ error: 'Failed to fetch interventions' }, { status: 500 });
  }

  return NextResponse.json({ interventions: data || [] });
}
