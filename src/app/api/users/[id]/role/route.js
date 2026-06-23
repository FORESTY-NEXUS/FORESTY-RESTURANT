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
    const body = await req.json();

    const dbUser = await User.findById(id);
    if (!dbUser) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    const validRoles = ['customer', 'admin', 'delivery'];
    if (!validRoles.includes(body.role)) {
       return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    dbUser.role = body.role;
    await dbUser.save();
    
    await logAudit(user._id, 'UPDATE_USER_ROLE', 'User', id, body);
    
    return NextResponse.json({ message: 'User role updated', role: dbUser.role });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
