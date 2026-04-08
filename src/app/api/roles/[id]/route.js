import { NextResponse } from 'next/server';
import { deleteRole, updateRole } from '@/lib/metadata';

function getStatusByCode(code) {
  if (code === 'NOT_FOUND') return 404;
  if (code === 'VALIDATION') return 400;
  if (code === 'CONFLICT') return 409;
  if (code === 'IN_USE') return 409;
  if (code === 'PROTECTED') return 409;
  return 500;
}

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return NextResponse.json({ error: 'Invalid role id' }, { status: 400 });
    }

    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    if (name.length > 64) {
      return NextResponse.json({ error: 'Role name is too long' }, { status: 400 });
    }

    const roleItems = await updateRole(numericId, name);
    const roles = roleItems.map(item => item.name);
    return NextResponse.json({ success: true, roles, roleItems });
  } catch (error) {
    console.error('Role update error:', error);
    const status = getStatusByCode(error?.code);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return NextResponse.json({ error: 'Invalid role id' }, { status: 400 });
    }

    const roleItems = await deleteRole(numericId);
    const roles = roleItems.map(item => item.name);
    return NextResponse.json({ success: true, roles, roleItems });
  } catch (error) {
    console.error('Role delete error:', error);
    const status = getStatusByCode(error?.code);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status });
  }
}
