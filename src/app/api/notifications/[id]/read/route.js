import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getSession } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    await connectDB();
    const { id } = await params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
