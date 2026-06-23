import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getSession, requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/api-helpers';

export async function POST(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();
    const body = await req.json();
    const { name, email, password, role } = body;

    const userExists = await User.findOne({ email });
    if (userExists) return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    
    const validRoles = ['customer', 'admin', 'delivery'];
    if (!validRoles.includes(role)) return NextResponse.json({ message: 'Invalid role' }, { status: 400 });

    const newUser = await User.create({ name, email, password, role });
    await logAudit(user._id, 'CREATE_USER', 'User', newUser._id, body);

    return NextResponse.json({ _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    
    let query = {};
    if (role) query.role = role;
    
    const users = await User.find(query).select('-password');
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
