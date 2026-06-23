import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attemptsLeft: { type: Number, default: 3 }
});

export default mongoose.models.OTP || mongoose.model('OTP', otpSchema);
