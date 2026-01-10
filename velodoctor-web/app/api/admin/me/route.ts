import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  return NextResponse.json({
    userId: auth.userId,
    role: auth.role,
  });
}
