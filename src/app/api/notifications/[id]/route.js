import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await sql`UPDATE notifications SET read = true WHERE notif_id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
