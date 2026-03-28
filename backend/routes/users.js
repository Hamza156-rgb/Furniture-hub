const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ─── GET /api/users/profile ───────────────────────────────────────────────────
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/users/profile ───────────────────────────────────────────────────
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { firstName, lastName, phone, city, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, city, address },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/users/change-password ──────────────────────────────────────────
router.put('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both fields required' });

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password incorrect' });

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password min 6 chars' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
