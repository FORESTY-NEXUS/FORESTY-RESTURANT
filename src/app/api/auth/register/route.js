import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/lib/db';
import { registerSchema } from '@/lib/schemas';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Validate
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      return NextResponse.json({ 
        message: issues[0]?.message || 'Validation Error',
        errors: issues
      }, { status: 400 });
    }

    const { name, email, password, phone } = parsed.data;
    const role = 'customer';

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const user = await User.create({ name, email, password, phone, role });

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    }, { status: 201 });

  } catch (error) {
    if (error.message?.toLowerCase().includes('authentication failed')) {
      return NextResponse.json({
        message: 'Database authentication failed. Check MONGODB_URI credentials and restart the dev server.',
      }, { status: 500 });
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
