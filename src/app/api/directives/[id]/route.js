import sql from '@/lib/db';
import { getBearerToken, verifyAuthToken } from '@/lib/session';
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

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const token = getBearerToken(request);
    const authPayload = verifyAuthToken(token);
    if (!authPayload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requesterRows = await sql`
      SELECT user_id, role, status
      FROM users
      WHERE user_id = ${authPayload.userId}
      LIMIT 1
    `;

    if (requesterRows.length === 0) {
      return NextResponse.json({ error: 'Requester not found' }, { status: 403 });
    }

    if (requesterRows[0].status !== 'Active') {
      return NextResponse.json({ error: 'Requester is not active' }, { status: 403 });
    }

    const directiveRows = await sql`
      SELECT d.directive_id, d.issued_by, u.role AS issued_by_role
      FROM directives d
      LEFT JOIN users u ON u.user_id = d.issued_by
      WHERE d.directive_id = ${id}
      LIMIT 1
    `;

    if (directiveRows.length === 0) {
      return NextResponse.json({ error: 'Directive not found' }, { status: 404 });
    }

    const requesterRole = (requesterRows[0].role || '').toLowerCase();
    const issuerRole = (directiveRows[0].issued_by_role || '').toLowerCase();

    const isChairman = requesterRole === 'chairman';
    const isCEO = requesterRole === 'ceo';

    // Rules:
    // - Chairman can delete any directive.
    // - CEO can delete any directive except those issued by Chairman.
    // - Everyone else cannot delete directives.
    if (!isChairman && !(isCEO && issuerRole !== 'chairman')) {
      return NextResponse.json({ error: 'Not authorized to delete this directive' }, { status: 403 });
    }

    await sql`DELETE FROM tasks WHERE directive_id = ${id}`;
    await sql`DELETE FROM comments WHERE directive_id = ${id}`;
    await sql`DELETE FROM attachments WHERE directive_id = ${id}`;
    await sql`DELETE FROM notifications WHERE directive_id = ${id}`;
    await sql`DELETE FROM audit_logs WHERE directive_id = ${id}`;
    await sql`DELETE FROM directives WHERE directive_id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete directive error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
