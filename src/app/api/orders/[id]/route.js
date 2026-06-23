import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSession } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    await connectDB();
    const { id } = await params;
    
    const order = await Order.findById(id)
      .populate('userId', 'name email phone avatar')
      .populate('assignedDeliveryId', 'name phone avatar');
      
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    
    if (user.role === 'customer' && order.userId._id.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
