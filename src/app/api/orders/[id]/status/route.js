import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import MenuItem from '@/lib/models/MenuItem';
import { getSession, requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/api-helpers';

export async function PUT(req, { params }) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    // Allowed for admin or delivery
    if (user.role !== 'admin' && user.role !== 'delivery') {
         if (user.role === 'customer') {
             // Let role fall through if customer canceling order (later check)
         } else {
             return NextResponse.json({ message: `Not authorized` }, { status: 403 });
         }
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    const order = await Order.findById(id);
    
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    
    // Cancellation rules
    if (status === 'cancelled') {
        if (user.role === 'customer' && !['pending', 'accepted'].includes(order.status)) {
            return NextResponse.json({ message: 'Cannot cancel order at this stage' }, { status: 400 });
        }
        
        // Return stock
        for (let item of order.items) {
          const menuItem = await MenuItem.findById(item.menuItemId);
          if (menuItem && menuItem.stock !== -1) {
             menuItem.stock += item.quantity;
             menuItem.availability = true;
             await menuItem.save();
          }
        }
    } else {
        if (user.role === 'customer') {
             return NextResponse.json({ message: `Customers can only cancel orders` }, { status: 403 });
        }
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note: note || '',
      user: user._id
    });
    
    const updatedOrder = await order.save();
    await logAudit(user._id, 'UPDATE_ORDER_STATUS', 'Order', id, body);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
