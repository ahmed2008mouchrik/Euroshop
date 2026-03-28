import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'euroshop2024';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ success: true, token: ADMIN_PASSWORD });
  }

  return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
}
