import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const t = await request.json();
    await sql`INSERT INTO tasks (task_id, directive_id, title, status, assigned_to, due, progress)
      VALUES (${t.task_id}, ${id}, ${t.title}, ${t.status}, ${t.assigned_to}, ${t.due || null}, ${t.progress})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
