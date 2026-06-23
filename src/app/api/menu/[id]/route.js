import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/lib/models/MenuItem';
import { getSession, requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/api-helpers';
import { menuItemSchema } from '@/lib/schemas';

export async function PUT(req, { params }) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const parsed = menuItemSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      return NextResponse.json({ 
        message: issues[0]?.message || 'Validation Error',
        errors: issues
      }, { status: 400 });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(id, parsed.data, { new: true });
    await logAudit(user._id, 'UPDATE_MENU_ITEM', 'Menu', id, body);

    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();
    const { id } = await params;
    
    await MenuItem.findByIdAndDelete(id);
    await logAudit(user._id, 'DELETE_MENU_ITEM', 'Menu', id);

    return NextResponse.json({ message: 'Menu item removed' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
