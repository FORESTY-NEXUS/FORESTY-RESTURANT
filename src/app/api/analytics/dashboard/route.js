import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import MenuItem from '@/lib/models/MenuItem';
import { getSession, requireRoles } from '@/lib/auth';

export async function GET(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    await connectDB();

    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfToday } });
    
    const revenueAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
    
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalMenu = await MenuItem.countDocuments();
    
    return NextResponse.json({
        todayOrders,
        totalRevenue,
        totalCustomers,
        totalMenu
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
