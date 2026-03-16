import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const u = await request.json();
    await sql`UPDATE users SET
      name = ${u.name},
      email = ${u.email},
      role = ${u.role},
      dept = ${u.dept},
      status = ${u.status},
      phone = ${u.phone || null},
      updated_at = NOW()
      WHERE user_id = ${id}`;
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
