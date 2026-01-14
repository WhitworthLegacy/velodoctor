import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireStaff } from '@/lib/adminAuth';
import { applyCors } from '@/lib/cors';

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[admin] client fetch failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ client: data }));
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));
  const { data, error } = await auth.supabase
    .from('clients')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[admin] client update failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to update client' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ client: data }));
}

export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireAdmin(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { error } = await auth.supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[admin] client delete failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to delete client' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ success: true }));
}
