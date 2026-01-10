import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from('crm_columns')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    console.error('[admin] crm columns failed:', error);
    return NextResponse.json({ error: 'Failed to fetch CRM columns' }, { status: 500 });
  }

  return NextResponse.json({ columns: data || [] });
}
