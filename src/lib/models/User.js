import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'delivery'], 
    default: 'customer' 
  },
  phone: { type: String },
  avatar: { type: String },
  addresses: [{
    house: String,
    street: String,
    area: String,
    city: String,
    province: String,
    postalCode: String,
    lat: Number,
    lng: Number,
    isDefault: { type: Boolean, default: false }
  }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
