const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ─── GET /api/products ───────────────────────────────────────────────────────
// Public – filter by city, category name, search
router.get('/', async (req, res, next) => {
  try {
    const { city, categoryName, search, page = 1, limit = 24 } = req.query;

    let shopIds;
    if (city && city !== 'all') {
      const shops = await Shop.find({ shopCity: { $regex: new RegExp(city, 'i') }, isActive: true });
      shopIds = shops.map((s) => s._id);
    }

    const query = {};
    if (shopIds) query.shop = { $in: shopIds };

    if (categoryName) {
      const cats = await Category.find({ name: { $regex: new RegExp(categoryName, 'i') } });
      query.category = { $in: cats.map((c) => c._id) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('shop', 'shopName shopCity shopLogo')
      .populate('category', 'name icon')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ success: true, total, products });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/shop/:shopId ──────────────────────────────────────────
router.get('/shop/:shopId', async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const query = { shop: req.params.shopId };
    if (categoryId) query.category = categoryId;

    const products = await Product.find(query)
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/products ──────────────────────────────────────────────────────
router.post('/', protect, authorize('owner'), upload.array('images', 5), async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const { name, description, price, categoryId, inStock, featured, tags } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const category = await Category.findOne({ _id: categoryId, shop: shop._id });
    if (!category) return res.status(400).json({ success: false, message: 'Category not found in your shop' });

    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
      shop: shop._id,
      category: categoryId,
      name,
      description: description || '',
      price: Number(price),
      images,
      inStock: inStock !== undefined ? inStock === 'true' || inStock === true : true,
      featured: featured === 'true' || featured === true,
      tags: tags ? JSON.parse(tags) : [],
    });

    const populated = await product.populate('category', 'name icon');
    res.status(201).json({ success: true, product: populated });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/products/:id ───────────────────────────────────────────────────
router.put('/:id', protect, authorize('owner'), upload.array('images', 5), async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, shop: shop._id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { name, description, price, categoryId, inStock, featured, tags } = req.body;
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price) product.price = Number(price);
    if (categoryId) product.category = categoryId;
    if (inStock !== undefined) product.inStock = inStock === 'true' || inStock === true;
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (tags) product.tags = JSON.parse(tags);
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    await product.save();
    const populated = await product.populate('category', 'name icon');
    res.json({ success: true, product: populated });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
router.delete('/:id', protect, authorize('owner'), async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const product = await Product.findOneAndDelete({ _id: req.params.id, shop: shop._id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
