const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Order = require('../models/Order');
const OTP = require('../models/OTP');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { otpLimiter } = require('../middleware/rateLimiter');

// @desc    Generate and send OTP (simulated send)
// @route   POST /api/otp/generate
// @access  Private/Admin
router.post('/generate', protect, authorize('admin'), async (req, res) => {
  const { orderId } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await OTP.findOneAndUpdate(
      { orderId },
      { otpHash, expiresAt, attemptsLeft: 3 },
      { upsert: true, new: true }
    );

    // In a real app, send OTP via SMS/Email
    console.log(`[OTP SIMULATION] Order ${orderId}: ${otp}`);

    res.json({ message: 'OTP generated and sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify OTP and complete order
// @route   POST /api/otp/verify
// @access  Private/Delivery
router.post('/verify', otpLimiter, protect, authorize('delivery'), async (req, res) => {
  const { orderId, otp } = req.body;

  try {
    const otpDoc = await OTP.findOne({ orderId });

    if (!otpDoc) {
      return res.status(404).json({ message: 'OTP not found for this order' });
    }

    if (new Date() > otpDoc.expiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (otpDoc.attemptsLeft <= 0) {
      return res.status(400).json({ message: 'Max attempts reached' });
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otpHash);

    if (isMatch) {
      await Order.findByIdAndUpdate(orderId, { status: 'delivered' });
      await OTP.deleteOne({ orderId });
      res.json({ message: 'Order delivered successfully' });
    } else {
      otpDoc.attemptsLeft -= 1;
      await otpDoc.save();
      res.status(400).json({ message: 'Invalid OTP', attemptsLeft: otpDoc.attemptsLeft });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
