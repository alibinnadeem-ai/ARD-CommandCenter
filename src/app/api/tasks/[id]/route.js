import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status, progress } = await request.json();
    await sql`UPDATE tasks SET status = ${status}, progress = ${progress}, updated_at = NOW() WHERE task_id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
