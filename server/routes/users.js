const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLog } = require('../middleware/audit');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all riders
// @route   GET /api/users/riders
// @access  Private/Admin
router.get('/riders', protect, authorize('admin'), async (req, res) => {
  try {
    const riders = await User.find({ role: 'delivery' }).select('-password');
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user status (activate/suspend)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), auditLog('UPDATE_USER_STATUS', 'User'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isActive = req.body.isActive;
    await user.save();
    
    res.json({ message: 'User status updated', isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put('/:id/role', protect, authorize('admin'), auditLog('UPDATE_USER_ROLE', 'User'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const validRoles = ['customer', 'admin', 'delivery'];
    if (!validRoles.includes(req.body.role)) {
       return res.status(400).json({ message: 'Invalid role' });
    }

    user.role = req.body.role;
    await user.save();
    
    res.json({ message: 'User role updated', role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
