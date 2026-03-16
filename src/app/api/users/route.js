import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const u = await request.json();
    await sql`INSERT INTO users (user_id, name, email, password, role, dept, status, joined, phone)
      VALUES (${u.user_id}, ${u.name}, ${u.email}, ${u.password || 'demo'}, ${u.role}, ${u.dept}, ${u.status}, ${u.joined}, ${u.phone || null})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
