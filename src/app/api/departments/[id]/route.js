import { NextResponse } from 'next/server';
import { deleteDepartment, updateDepartment } from '@/lib/metadata';

function getStatusByCode(code) {
  if (code === 'NOT_FOUND') return 404;
  if (code === 'VALIDATION') return 400;
  if (code === 'CONFLICT') return 409;
  if (code === 'IN_USE') return 409;
  return 500;
}

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return NextResponse.json({ error: 'Invalid department id' }, { status: 400 });
    }

    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    if (name.length > 64) {
      return NextResponse.json({ error: 'Department name is too long' }, { status: 400 });
    }

    const departmentItems = await updateDepartment(numericId, name);
    const departments = departmentItems.map(item => item.name);
    return NextResponse.json({ success: true, departments, departmentItems });
  } catch (error) {
    console.error('Department update error:', error);
    const status = getStatusByCode(error?.code);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return NextResponse.json({ error: 'Invalid department id' }, { status: 400 });
    }

    const departmentItems = await deleteDepartment(numericId);
    const departments = departmentItems.map(item => item.name);
    return NextResponse.json({ success: true, departments, departmentItems });
  } catch (error) {
    console.error('Department delete error:', error);
    const status = getStatusByCode(error?.code);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status });
  }
}
