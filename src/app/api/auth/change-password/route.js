import sql from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { user_id, currentPassword, newPassword } = await request.json();

    if (!user_id || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: 'New password must be at least 4 characters' }, { status: 400 });
    }

    const rows = await sql`
      SELECT user_id, password
      FROM users
      WHERE user_id = ${user_id}
      LIMIT 1
    `;

    if (rows.length === 0 || !(await verifyPassword(currentPassword, rows[0].password))) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const passwordHash = await hashPassword(newPassword);

    await sql`
      UPDATE users
      SET password = ${passwordHash}, updated_at = NOW()
      WHERE user_id = ${user_id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
