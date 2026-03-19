import sql from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const u = await request.json();
    const password = typeof u.password === 'string' ? u.password.trim() : '';
    if (password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }
    const passwordHash = await hashPassword(password);

    await sql`INSERT INTO users (user_id, name, email, password, role, dept, status, joined, phone)
      VALUES (${u.user_id}, ${u.name}, ${u.email}, ${passwordHash}, ${u.role}, ${u.dept}, ${u.status}, ${u.joined}, ${u.phone || null})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
