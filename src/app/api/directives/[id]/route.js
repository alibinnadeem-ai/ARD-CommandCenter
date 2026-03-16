import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await sql`UPDATE directives SET
      status = ${body.status},
      progress = ${body.progress},
      updated_at = NOW()
      WHERE directive_id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update directive error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
