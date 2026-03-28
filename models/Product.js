const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price:       { type: Number, required: true, min: 0 },
    images:      [{ type: String }],
    inStock:     { type: Boolean, default: true },
    featured:    { type: Boolean, default: false },
    tags:        [{ type: String }],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ shop: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
