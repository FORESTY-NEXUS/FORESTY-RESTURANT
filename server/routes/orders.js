const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLog } = require('../middleware/audit');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, address, phone, customerName, paymentMethod, deliveryNotes } = req.body;
    
    // Verify stock and calculate totals
    let calculatedTotal = 0;
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.availability || (menuItem.stock !== -1 && menuItem.stock < item.quantity)) {
        return res.status(400).json({ message: `Item ${item.name} is unavailable or out of stock.` });
      }
      calculatedTotal += menuItem.price * item.quantity;
      
      // Deduct stock if not unlimited
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
      userId: req.user._id,
      customerName: customerName || req.user.name,
      items,
      totalPrice: calculatedTotal,
      tax,
      deliveryFee,
      grandTotal,
      paymentMethod: paymentMethod || 'cod',
      address,
      phone,
      deliveryNotes,
      statusHistory: [{ status: 'pending', user: req.user._id, note: 'Order created' }]
    });

    // Emit event to admins
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('new_order', order);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get user orders or all orders if admin
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({}).populate('userId', 'name email').populate('assignedDeliveryId', 'name phone');
    } else {
      orders = await Order.find({ userId: req.user._id }).populate('assignedDeliveryId', 'name phone');
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone avatar')
      .populate('assignedDeliveryId', 'name phone avatar');
      
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (req.user.role === 'customer' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin|Delivery
router.put('/:id/status', protect, auditLog('UPDATE_ORDER_STATUS', 'Order'), async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Cancellation rules
    if (status === 'cancelled') {
        if (req.user.role === 'customer' && !['pending', 'accepted'].includes(order.status)) {
            return res.status(400).json({ message: 'Cannot cancel order at this stage' });
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
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note: note || '',
      user: req.user._id
    });
    
    const updatedOrder = await order.save();
    
    // Emit event to the user's room
    const io = req.app.get('io');
    if (io) {
      io.to(order.userId.toString()).emit('order_status_update', updatedOrder);
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Assign delivery agent
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
router.put('/:id/assign', protect, authorize('admin'), auditLog('ASSIGN_RIDER', 'Order'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.assignedDeliveryId = req.body.deliveryId;
    order.status = 'rider_assigned';
    order.statusHistory.push({
      status: 'rider_assigned',
      user: req.user._id,
      note: 'Rider assigned by admin'
    });
    
    const updatedOrder = await order.save();
    
    const io = req.app.get('io');
    if (io) {
      io.to(order.userId.toString()).emit('order_status_update', updatedOrder);
      io.to(req.body.deliveryId.toString()).emit('new_assignment', updatedOrder);
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
