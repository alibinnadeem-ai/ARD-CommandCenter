import sql from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const u = await request.json();

    const nextPassword =
      typeof u.newPassword === 'string'
        ? u.newPassword.trim()
        : (typeof u.password === 'string' ? u.password.trim() : '');

    if (nextPassword && nextPassword.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }

    if (nextPassword) {
      const passwordHash = await hashPassword(nextPassword);
      await sql`UPDATE users SET
        name = ${u.name},
        email = ${u.email},
        role = ${u.role},
        dept = ${u.dept},
        status = ${u.status},
        phone = ${u.phone || null},
        password = ${passwordHash},
        updated_at = NOW()
        WHERE user_id = ${id}`;
    } else {
      await sql`UPDATE users SET
        name = ${u.name},
        email = ${u.email},
        role = ${u.role},
        dept = ${u.dept},
        status = ${u.status},
        phone = ${u.phone || null},
        updated_at = NOW()
        WHERE user_id = ${id}`;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await sql`DELETE FROM users WHERE user_id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
