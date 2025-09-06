const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
