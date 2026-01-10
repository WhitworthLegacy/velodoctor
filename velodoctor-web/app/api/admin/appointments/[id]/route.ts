import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

const ADMIN_ROLES = new Set(['admin', 'super_admin']);

async function requireAdmin(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const supabase = getSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profileError) {
    console.error('[admin] profile lookup failed:', profileError);
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (!ADMIN_ROLES.has(profile?.role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { supabase };
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) {
      return auth.error;
    }

    const { supabase } = auth;
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('[admin] appointment delete failed:', error);
      return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin] delete route error:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
