const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLog } = require('../middleware/audit');

// @desc    Get assigned orders for delivery agent
// @route   GET /api/delivery/orders
// @access  Private/Delivery
router.get('/orders', protect, authorize('delivery'), async (req, res) => {
  try {
    const orders = await Order.find({ 
      assignedDeliveryId: req.user._id,
      status: { $in: ['accepted', 'preparing', 'ready', 'rider_assigned', 'picked_up', 'out_for_delivery', 'arrived'] }
    }).populate('userId', 'name email phone avatar');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update delivery order status
// @route   PUT /api/delivery/orders/:id/status
// @access  Private/Delivery
router.put('/orders/:id/status', protect, authorize('delivery'), auditLog('RIDER_UPDATE_STATUS', 'Order'), async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findOne({ _id: req.params.id, assignedDeliveryId: req.user._id });
    
    if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });
    
    const validStatuses = ['picked_up', 'out_for_delivery', 'arrived'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status for delivery agent' });
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

// @desc    Get delivery agent stats
// @route   GET /api/delivery/stats
// @access  Private/Delivery
router.get('/stats', protect, authorize('delivery'), async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    
    const todayOrders = await Order.find({ 
        assignedDeliveryId: req.user._id, 
        status: 'delivered',
        updatedAt: { $gte: startOfDay }
    });
    
    const totalOrders = await Order.countDocuments({
        assignedDeliveryId: req.user._id, 
        status: 'delivered'
    });
    
    res.json({
        todayCompleted: todayOrders.length,
        totalCompleted: totalOrders,
        // Calculate earnings if we had a fee logic
        todayEarnings: todayOrders.length * 150 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
