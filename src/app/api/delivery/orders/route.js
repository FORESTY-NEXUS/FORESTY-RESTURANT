import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSession, requireRoles } from '@/lib/auth';

export async function GET(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'delivery');
    if (roleError) return roleError;

    await connectDB();

    const orders = await Order.find({ 
      assignedDeliveryId: user._id,
      status: { $in: ['accepted', 'preparing', 'ready', 'rider_assigned', 'picked_up', 'out_for_delivery', 'arrived'] }
    }).populate('userId', 'name email phone avatar');

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
