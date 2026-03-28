const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    shopName:     { type: String, required: true, trim: true },
    shopNumber:   { type: String, required: true, trim: true },
    shopLocation: { type: String, required: true, trim: true },
    shopCity:     { type: String, required: true, trim: true },
    shopAddress:  { type: String, required: true, trim: true },
    shopTimings:  { type: String, required: true, trim: true },
    shopLogo:     { type: String, default: '' },
    tagline:      { type: String, default: '', trim: true },
    rating:       { type: Number, default: 0 },
    reviewCount:  { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: categories for this shop
shopSchema.virtual('categories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'shop',
});

// Virtual: products count
shopSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'shop',
});

// Index for city-based search
shopSchema.index({ shopCity: 1 });
shopSchema.index({ shopName: 'text', shopLocation: 'text', shopCity: 'text' });

module.exports = mongoose.model('Shop', shopSchema);
