import sql from '@/lib/db';
import { hashPassword, isBcryptHash, verifyPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const rows = await sql`
      SELECT user_id, name, email, role, dept, status, joined, phone, password
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];
    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!isBcryptHash(user.password)) {
      const upgradedHash = await hashPassword(password);
      await sql`UPDATE users SET password = ${upgradedHash}, updated_at = NOW() WHERE user_id = ${user.user_id}`;
    }

    const { password: _password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
