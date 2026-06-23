import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/lib/models/MenuItem';
import { getSession, requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/api-helpers';
import { menuItemSchema } from '@/lib/schemas';

export async function GET() {
  try {
    await connectDB();
    const menuItems = await MenuItem.find({ availability: true });
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();
    const body = await req.json();

    const parsed = menuItemSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      return NextResponse.json({ 
        message: issues[0]?.message || 'Validation Error',
        errors: issues
      }, { status: 400 });
    }

    const menuItem = await MenuItem.create(parsed.data);
    await logAudit(user._id, 'CREATE_MENU_ITEM', 'Menu', menuItem._id, body);

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
