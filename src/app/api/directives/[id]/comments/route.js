import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const c = await request.json();
    await sql`INSERT INTO comments (comment_id, directive_id, user_id, text, created_at)
      VALUES (${c.comment_id}, ${id}, ${c.user_id}, ${c.text}, ${c.ts})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
