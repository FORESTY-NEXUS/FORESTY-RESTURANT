import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    await connectDB();

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50);
      
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
