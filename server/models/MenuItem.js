const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  image: { type: String }, // Primary image
  images: [{ type: String }], // Gallery images
  stock: { type: Number, default: -1 }, // -1 means unlimited
  tags: [{ type: String }],
  isArchived: { type: Boolean, default: false },
  preparationTime: { type: Number, default: 15 }, // in minutes
  availability: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
