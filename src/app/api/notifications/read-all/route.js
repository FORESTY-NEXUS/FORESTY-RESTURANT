import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getSession } from '@/lib/auth';

export async function PUT(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    await connectDB();

    await Notification.updateMany(
      { userId: user._id, read: false },
      { read: true }
    );
    
    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
