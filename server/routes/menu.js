const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ availability: true });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
