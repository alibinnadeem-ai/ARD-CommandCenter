import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const n = await request.json();
    await sql`INSERT INTO notifications (notif_id, user_id, type, title, message, directive_id, read, created_at)
      VALUES (${n.notif_id}, ${n.user_id}, ${n.type}, ${n.title}, ${n.message}, ${n.directive_id}, ${n.read}, ${n.ts})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
