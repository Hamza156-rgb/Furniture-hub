const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ success: true, token, user });
};

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('firstName').notEmpty().withMessage('First name required'),
    body('lastName').notEmpty().withMessage('Last name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').notEmpty().withMessage('Phone required'),
    body('city').notEmpty().withMessage('City required'),
    body('address').notEmpty().withMessage('Address required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').isIn(['user', 'owner']).withMessage('Role must be user or owner'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const {
        firstName, lastName, email, phone, city, address, password, role,
        shopName, shopNumber, shopLocation, shopCity, shopAddress, shopTimings, tagline,
      } = req.body;

      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ success: false, message: 'Email already registered' });

      const user = await User.create({ firstName, lastName, email, phone, city, address, password, role });

      // If registering as shop owner, create the shop profile
      if (role === 'owner') {
        if (!shopName || !shopNumber || !shopLocation || !shopCity || !shopAddress || !shopTimings) {
          await User.findByIdAndDelete(user._id);
          return res.status(400).json({ success: false, message: 'All shop fields are required for owner registration' });
        }
        await Shop.create({
          owner: user._id,
          shopName, shopNumber, shopLocation, shopCity, shopAddress, shopTimings,
          tagline: tagline || '',
        });
      }

      sendToken(user, 201, res);
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ success: false, message: 'Invalid email or password' });

      // If owner, attach shop info
      let shop = null;
      if (user.role === 'owner') {
        shop = await Shop.findOne({ owner: user._id });
      }

      const token = signToken(user._id);
      res.json({ success: true, token, user: user.toJSON(), shop });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let shop = null;
    if (user.role === 'owner') {
      shop = await Shop.findOne({ owner: user._id });
    }
    res.json({ success: true, user, shop });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
