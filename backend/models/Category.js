const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '🛋️' },
    description: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual: product count in this category
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

module.exports = mongoose.model('Category', categorySchema);
