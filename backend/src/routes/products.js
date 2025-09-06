const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Create product
router.post('/', auth, async (req, res) => {
  const { title, description, category, price, imageUrl } = req.body;
  if (!title || !category || price == null) return res.status(400).json({ error: 'Missing fields' });
  const p = await Product.create({
    ownerId: req.user._id,
    title, description, category, price, imageUrl: imageUrl || '/placeholder.png'
  });
  res.status(201).json(p);
});

// List with search, category, pagination
router.get('/', async (req, res) => {
  const { q, category, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };
  const skip = (Math.max(1, page) - 1) * limit;
  const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
  const total = await Product.countDocuments(filter);
  res.json({ products, total });
});

router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Update
router.put('/:id', auth, async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  if (p.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
  const fields = ['title','description','category','price','imageUrl','isActive'];
  fields.forEach(f => { if (req.body[f] !== undefined) p[f] = req.body[f]; });
  await p.save();
  res.json(p);
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  if (p.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
  await p.deleteOne();
  res.status(204).send();
});

module.exports = router;
