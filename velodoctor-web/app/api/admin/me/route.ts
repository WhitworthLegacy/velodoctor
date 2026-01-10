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

  return applyCors(NextResponse.json({
    userId: auth.userId,
    role: auth.role,
  }));
}
