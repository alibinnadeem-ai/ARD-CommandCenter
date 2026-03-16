import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const d = await request.json();
    await sql`INSERT INTO directives (directive_id, title, description, issued_by, assigned_to, delegated_to, dept, priority, status, progress, deadline, created_at)
      VALUES (${d.directive_id}, ${d.title}, ${d.description}, ${d.issued_by}, ${d.assigned_to}, ${d.delegated_to}, ${d.dept}, ${d.priority}, ${d.status}, ${d.progress}, ${d.deadline}, ${d.created})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create directive error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
