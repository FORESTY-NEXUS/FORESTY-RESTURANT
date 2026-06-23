import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import MenuItem from '@/lib/models/MenuItem';
import { getSession, requireRoles } from '@/lib/auth';

export async function POST(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    await connectDB();
    const body = await req.json();
    const { items, address, phone, customerName, paymentMethod, deliveryNotes } = body;
    
    let calculatedTotal = 0;
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.availability || (menuItem.stock !== -1 && menuItem.stock < item.quantity)) {
        return NextResponse.json({ message: `Item ${item.name} is unavailable or out of stock.` }, { status: 400 });
      }
      calculatedTotal += menuItem.price * item.quantity;
      
      if (menuItem.stock !== -1) {
        menuItem.stock -= item.quantity;
        if (menuItem.stock === 0) menuItem.availability = false;
        await menuItem.save();
      }
    }

    const tax = calculatedTotal * 0.16; // 16% GST
    const deliveryFee = 150; // Flat fee
    const grandTotal = calculatedTotal + tax + deliveryFee;

    const order = await Order.create({
      userId: user._id,
      customerName: customerName || user.name,
      items,
      totalPrice: calculatedTotal,
      tax,
      deliveryFee,
      grandTotal,
      paymentMethod: paymentMethod || 'cod',
      address,
      phone,
      deliveryNotes,
      statusHistory: [{ status: 'pending', user: user._id, note: 'Order created' }]
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    await connectDB();
    let orders;
    
    if (user.role === 'admin') {
      orders = await Order.find({}).populate('userId', 'name email').populate('assignedDeliveryId', 'name phone');
    } else {
      orders = await Order.find({ userId: user._id }).populate('assignedDeliveryId', 'name phone');
    }
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
