import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_PASSWORD environment variable is not set');
  }
  return password;
}

export function generateToken(password: string): string {
  return crypto
    .createHmac('sha256', password)
    .update('euroshop-admin-token')
    .digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const adminPassword = getAdminPassword();
    const { password } = await req.json();

    if (typeof password !== 'string' || password.length === 0) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const expected = Buffer.from(adminPassword, 'utf-8');
    const received = Buffer.from(password, 'utf-8');

    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    }

    const token = generateToken(adminPassword);
    return NextResponse.json({ success: true, token });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
