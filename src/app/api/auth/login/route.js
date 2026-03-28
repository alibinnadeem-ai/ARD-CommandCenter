import sql from '@/lib/db';
import { hashPassword, isBcryptHash, verifyPassword } from '@/lib/auth';
import { createAuthToken } from '@/lib/session';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const emailNorm = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const passwordNorm = typeof password === 'string' ? password : '';

    if (!emailNorm || !passwordNorm) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const rows = await sql`
      SELECT user_id, name, email, role, dept, status, password
      FROM users
      WHERE LOWER(TRIM(email)) = ${emailNorm}
      LIMIT 1
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];
    const ok = await verifyPassword(passwordNorm, user.password);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!isBcryptHash(user.password)) {
      const upgradedHash = await hashPassword(passwordNorm);
      // Keep upgrade write compatible with older schemas that don't have updated_at.
      await sql`UPDATE users SET password = ${upgradedHash} WHERE user_id = ${user.user_id}`;
    }

    const { password: _password, ...safeUser } = user;
    const token = createAuthToken({ userId: safeUser.user_id, role: safeUser.role });
    return NextResponse.json({ ...safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
