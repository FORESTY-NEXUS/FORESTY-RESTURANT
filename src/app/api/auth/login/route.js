import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/lib/db';
import { loginSchema } from '@/lib/schemas';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      return NextResponse.json({ 
        message: issues[0]?.message || 'Validation Error',
        errors: issues
      }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (user.isActive === false) {
        return NextResponse.json({ message: 'Account is suspended. Please contact support.' }, { status: 403 });
      }

      user.lastLogin = new Date();
      await user.save();

      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
