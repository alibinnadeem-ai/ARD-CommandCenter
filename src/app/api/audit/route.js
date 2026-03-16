import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const l = await request.json();
    await sql`INSERT INTO audit_logs (log_id, user_id, directive_id, action, prev_status, next_status, ip_address, created_at)
      VALUES (${l.log_id}, ${l.user_id}, ${l.directive_id}, ${l.action}, ${l.prev}, ${l.next}, ${l.ip}, ${l.ts})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create audit log error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
