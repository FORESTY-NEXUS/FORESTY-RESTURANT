const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    
    // Aggregations
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfToday } });
    
    // Total Revenue
    const revenueAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
    
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalMenu = await MenuItem.countDocuments();
    
    res.json({
        todayOrders,
        totalRevenue,
        totalCustomers,
        totalMenu
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
