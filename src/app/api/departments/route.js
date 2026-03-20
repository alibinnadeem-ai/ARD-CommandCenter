import { NextResponse } from 'next/server';
import { addDepartment, getDepartments } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const departmentItems = await getDepartments();
    const departments = departmentItems.map(item => item.name);
    return NextResponse.json({ departments, departmentItems });
  } catch (error) {
    console.error('Departments fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    if (name.length > 64) {
      return NextResponse.json({ error: 'Department name is too long' }, { status: 400 });
    }

    const departmentItems = await addDepartment(name);
    const departments = departmentItems.map(item => item.name);
    return NextResponse.json({ success: true, departments, departmentItems });
  } catch (error) {
    console.error('Department create error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
