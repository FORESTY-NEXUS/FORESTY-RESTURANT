import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSession, requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/api-helpers';

export async function PUT(req, { params }) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    order.assignedDeliveryId = body.deliveryId;
    order.status = 'rider_assigned';
    order.statusHistory.push({
      status: 'rider_assigned',
      user: user._id,
      note: 'Rider assigned by admin'
    });
    
    const updatedOrder = await order.save();
    await logAudit(user._id, 'ASSIGN_RIDER', 'Order', id, body);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
