import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getSession, requireRoles } from '@/lib/auth';

export async function GET(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();
    const riders = await User.find({ role: 'delivery' }).select('-password');
    return NextResponse.json(riders);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
