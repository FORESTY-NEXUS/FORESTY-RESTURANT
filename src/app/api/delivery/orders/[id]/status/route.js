import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSession, requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/api-helpers';

export async function PUT(req, { params }) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'delivery');
    if (roleError) return roleError;

    await connectDB();
    const { id } = await params;
    const { status, note } = await req.json();

    const order = await Order.findOne({ _id: id, assignedDeliveryId: user._id });
    
    if (!order) return NextResponse.json({ message: 'Order not found or not assigned to you' }, { status: 404 });
    
    const validStatuses = ['picked_up', 'out_for_delivery', 'arrived'];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ message: 'Invalid status for delivery agent' }, { status: 400 });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note: note || '',
      user: user._id
    });
    
    const updatedOrder = await order.save();
    await logAudit(user._id, 'RIDER_UPDATE_STATUS', 'Order', id, { status, note });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
