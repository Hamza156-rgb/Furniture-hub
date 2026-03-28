const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ─── GET /api/shops ──────────────────────────────────────────────────────────
// Public – list all shops with optional city filter + search
router.get('/', async (req, res, next) => {
  try {
    const { city, search, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (city && city !== 'all') {
      query.shopCity = { $regex: new RegExp(city, 'i') };
    }
    if (search) {
      query.$or = [
        { shopName: { $regex: search, $options: 'i' } },
        { shopLocation: { $regex: search, $options: 'i' } },
        { shopCity: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Shop.countDocuments(query);
    const shops = await Shop.find(query)
      .populate('owner', 'firstName lastName')
      .populate({ path: 'categories', select: 'name icon', options: { sort: { order: 1 } } })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ success: true, total, page: Number(page), shops });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/shops/cities ───────────────────────────────────────────────────
router.get('/cities', async (req, res, next) => {
  try {
    const cities = await Shop.distinct('shopCity', { isActive: true });
    res.json({ success: true, cities: cities.sort() });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/shops/my ───────────────────────────────────────────────────────
// Owner – get their own shop
router.get('/my', protect, authorize('owner'), async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id })
      .populate({ path: 'categories', options: { sort: { order: 1 } } })
      .populate('products');
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, shop });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/shops/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'firstName lastName')
      .populate({ path: 'categories', options: { sort: { order: 1 } } });

    if (!shop || !shop.isActive)
      return res.status(404).json({ success: false, message: 'Shop not found' });

    // Get products grouped by category
    const products = await Product.find({ shop: shop._id }).sort({ createdAt: -1 });

    res.json({ success: true, shop, products });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/shops/my ───────────────────────────────────────────────────────
router.put('/my', protect, authorize('owner'), upload.single('shopLogo'), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.shopLogo = `/uploads/${req.file.filename}`;
    }
    const shop = await Shop.findOneAndUpdate(
      { owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    res.json({ success: true, shop });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
