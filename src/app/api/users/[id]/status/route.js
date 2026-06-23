import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getSession, requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/api-helpers';

export async function PUT(req, { params }) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();
    const { id } = await params;
    const { isActive } = await req.json();

    const dbUser = await User.findById(id);
    if (!dbUser) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    dbUser.isActive = isActive;
    await dbUser.save();
    
    await logAudit(user._id, 'UPDATE_USER_STATUS', 'User', id, { isActive });
    
    return NextResponse.json({ message: 'User status updated', isActive: dbUser.isActive });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
