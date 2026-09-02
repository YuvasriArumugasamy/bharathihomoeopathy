import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter category name'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Please enter category slug'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Category = mongoose.model('Category', categorySchema);
export default Category;
