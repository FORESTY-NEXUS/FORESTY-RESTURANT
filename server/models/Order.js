const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  totalPrice: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'stripe', 'card'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'ready', 'rider_assigned', 'picked_up', 'out_for_delivery', 'arrived', 'delivered', 'cancelled', 'refunded'], 
    default: 'pending' 
  },
  assignedDeliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  deliveryNotes: { type: String },
  estimatedDelivery: { type: Date },
  statusHistory: [{
    status: { type: String, required: true },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // The user (admin/rider) who changed it
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
