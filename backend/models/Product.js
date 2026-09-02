import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Please enter product slug'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  sku: {
    type: String,
    required: [true, 'Please enter SKU'],
    unique: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  shortDescription: {
    type: String,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select category'],
    index: true
  },
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: [true, 'Please enter regular price'],
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    default: null
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Threshold cannot be negative']
  },
  brand: {
    type: String,
    default: "Dr. Bharathi's Standard"
  },
  ingredients: [{
    type: String
  }],
  weight: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'g'
  },
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isBestSeller: {
    type: Boolean,
    default: false,
    index: true
  },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    focusKeyword: { type: String, default: '' }
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', shortDescription: 'text', brand: 'text' });

export const Product = mongoose.model('Product', productSchema);
export default Product;
