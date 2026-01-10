import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { error: updateError, data: appointment } = await auth.supabase
    .from('appointments')
    .update({ status: 'done' })
    .eq('id', params.id)
    .select('client_id')
    .single();

  if (updateError) {
    console.error('[admin] appointment completion failed:', updateError);
    return NextResponse.json({ error: 'Failed to complete appointment' }, { status: 500 });
  }

  if (appointment?.client_id) {
    const { error: clientError } = await auth.supabase
      .from('clients')
      .update({ crm_stage: 'cloture' })
      .eq('id', appointment.client_id);

    if (clientError) {
      console.error('[admin] client stage update failed:', clientError);
    }
  }

  return NextResponse.json({ success: true });
}
