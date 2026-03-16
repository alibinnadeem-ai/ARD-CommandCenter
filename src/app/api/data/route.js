import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [users, directives, tasks, comments, attachments, notifications, auditLogs] = await Promise.all([
      sql`SELECT * FROM users ORDER BY user_id`,
      sql`SELECT * FROM directives ORDER BY created_at DESC`,
      sql`SELECT * FROM tasks ORDER BY created_at`,
      sql`SELECT * FROM comments ORDER BY created_at`,
      sql`SELECT * FROM attachments ORDER BY created_at`,
      sql`SELECT * FROM notifications ORDER BY created_at`,
      sql`SELECT * FROM audit_logs ORDER BY created_at`,
    ]);

    // Assemble directives with nested tasks, comments, attachments
    const assembledDirectives = directives.map(d => ({
      directive_id: d.directive_id,
      title: d.title,
      description: d.description,
      issued_by: d.issued_by,
      assigned_to: d.assigned_to,
      delegated_to: d.delegated_to,
      dept: d.dept,
      priority: d.priority,
      status: d.status,
      progress: d.progress,
      deadline: d.deadline,
      created: d.created_at ? new Date(d.created_at).toISOString() : d.created_at,
      tasks: tasks.filter(t => t.directive_id === d.directive_id).map(t => ({
        task_id: t.task_id,
        title: t.title,
        status: t.status,
        assigned_to: t.assigned_to,
        due: t.due,
        progress: t.progress,
      })),
      comments: comments.filter(c => c.directive_id === d.directive_id).map(c => ({
        comment_id: c.comment_id,
        user_id: c.user_id,
        text: c.text,
        ts: c.created_at ? new Date(c.created_at).toISOString() : c.created_at,
      })),
      attachments: attachments.filter(a => a.directive_id === d.directive_id).map(a => ({
        name: a.name,
        size: a.size,
        uploaded: a.uploaded,
      })),
    }));

    // Map notification fields
    const mappedNotifications = notifications.map(n => ({
      notif_id: n.notif_id,
      user_id: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      directive_id: n.directive_id,
      read: n.read,
      ts: n.created_at ? new Date(n.created_at).toISOString() : n.created_at,
    }));

    // Map audit log fields  
    const mappedAudit = auditLogs.map(l => ({
      log_id: l.log_id,
      user_id: l.user_id,
      directive_id: l.directive_id,
      action: l.action,
      prev: l.prev_status,
      next: l.next_status,
      ts: l.created_at ? new Date(l.created_at).toISOString() : l.created_at,
      ip: l.ip_address,
    }));

    return NextResponse.json({
      users,
      directives: assembledDirectives,
      notifications: mappedNotifications,
      auditLog: mappedAudit,
    });
  } catch (error) {
    console.error('Data fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
