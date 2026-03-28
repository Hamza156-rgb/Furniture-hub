const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// ─── GET /api/categories/shop/:shopId ────────────────────────────────────────
router.get('/shop/:shopId', async (req, res, next) => {
  try {
    const categories = await Category.find({ shop: req.params.shopId })
      .sort({ order: 1 })
      .populate('productCount');
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/categories ────────────────────────────────────────────────────
router.post('/', protect, authorize('owner'), async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const { name, icon, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name required' });

    const existing = await Category.findOne({ shop: shop._id, name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return res.status(400).json({ success: false, message: 'Category already exists' });

    const count = await Category.countDocuments({ shop: shop._id });
    const category = await Category.create({ shop: shop._id, name, icon: icon || '🛋️', description, order: count });

    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/categories/:id ─────────────────────────────────────────────────
router.put('/:id', protect, authorize('owner'), async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const category = await Category.findOne({ _id: req.params.id, shop: shop._id });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const { name, icon, description } = req.body;
    if (name) category.name = name;
    if (icon) category.icon = icon;
    if (description !== undefined) category.description = description;
    await category.save();

    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/categories/:id ──────────────────────────────────────────────
router.delete('/:id', protect, authorize('owner'), async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const category = await Category.findOne({ _id: req.params.id, shop: shop._id });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: ${productCount} product(s) are in this category. Reassign or delete them first.`,
      });
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
