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

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    
    const todayOrders = await Order.find({ 
        assignedDeliveryId: user._id, 
        status: 'delivered',
        updatedAt: { $gte: startOfDay }
    });
    
    const totalOrders = await Order.countDocuments({
        assignedDeliveryId: user._id, 
        status: 'delivered'
    });
    
    return NextResponse.json({
        todayCompleted: todayOrders.length,
        totalCompleted: totalOrders,
        todayEarnings: todayOrders.length * 150 
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
