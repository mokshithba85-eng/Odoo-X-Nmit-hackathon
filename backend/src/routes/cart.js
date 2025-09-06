const express = require('express');
const auth = require('../middleware/auth');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Order = require('../models/Order');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const items = await CartItem.find({ userId: req.user._id }).populate('productId');
  const subtotal = items.reduce((s, it) => s + (it.productId.price * it.qty), 0);
  res.json({ items, subtotal });
});

router.post('/', auth, async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const upsert = await CartItem.findOneAndUpdate(
    { userId: req.user._id, productId },
    { $inc: { qty } }, { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(upsert);
});

router.put('/:productId', auth, async (req, res) => {
  const { qty } = req.body;
  const it = await CartItem.findOneAndUpdate({ userId: req.user._id, productId: req.params.productId }, { qty }, { new: true });
  if (!it) return res.status(404).json({ error: 'Not found' });
  res.json(it);
});

router.delete('/:productId', auth, async (req, res) => {
  await CartItem.deleteOne({ userId: req.user._id, productId: req.params.productId });
  res.status(204).send();
});

// Checkout
router.post('/checkout', auth, async (req, res) => {
  const items = await CartItem.find({ userId: req.user._id }).populate('productId');
  if (!items.length) return res.status(400).json({ error: 'Cart empty' });
  const orderItems = items.map(it => ({
    productId: it.productId._id,
    title: it.productId.title,
    price: it.productId.price,
    qty: it.qty,
    imageUrl: it.productId.imageUrl
  }));
  const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const order = await Order.create({ userId: req.user._id, items: orderItems, total });
  // clear cart
  await CartItem.deleteMany({ userId: req.user._id });
  res.json(order);
});

module.exports = router;
