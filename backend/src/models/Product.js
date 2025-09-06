const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, minlength: 3, maxlength: 80 },
  description: { type: String, maxlength: 1200, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '/placeholder.png' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

ProductSchema.index({ title: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
