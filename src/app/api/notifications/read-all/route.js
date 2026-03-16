import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const { user_id } = await request.json();
    await sql`UPDATE notifications SET read = true WHERE user_id = ${user_id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark all read error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
