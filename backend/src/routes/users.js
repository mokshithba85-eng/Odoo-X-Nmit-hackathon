const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const router = express.Router();

router.put('/me', auth, async (req, res) => {
  const { username, avatarUrl } = req.body;
  if (username) req.user.username = username;
  if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;
  await req.user.save();
  res.json(req.user);
});

router.get('/me/products', auth, async (req, res) => {
  const products = await Product.find({ ownerId: req.user._id });
  res.json(products);
});

module.exports = router;
