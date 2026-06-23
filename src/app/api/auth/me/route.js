import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import { generateToken, getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const fullUser = await User.findById(user._id).select('-password');
    if (fullUser) {
      return NextResponse.json(fullUser);
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const dbUser = await User.findById(user._id);

    if (dbUser) {
      dbUser.name = body.name || dbUser.name;
      dbUser.phone = body.phone || dbUser.phone;
      dbUser.avatar = body.avatar || dbUser.avatar;
      
      if (body.addresses) {
        dbUser.addresses = body.addresses;
      }

      if (body.password) {
        dbUser.password = body.password;
      }

      const updatedUser = await dbUser.save();

      return NextResponse.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        token: generateToken(updatedUser._id),
      });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
