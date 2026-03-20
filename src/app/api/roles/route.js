import { NextResponse } from 'next/server';
import { addRole, getRoles } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const roleItems = await getRoles();
    const roles = roleItems.map(item => item.name);
    return NextResponse.json({ roles, roleItems });
  } catch (error) {
    console.error('Roles fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    if (name.length > 64) {
      return NextResponse.json({ error: 'Role name is too long' }, { status: 400 });
    }

    const roleItems = await addRole(name);
    const roles = roleItems.map(item => item.name);
    return NextResponse.json({ success: true, roles, roleItems });
  } catch (error) {
    console.error('Role create error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
