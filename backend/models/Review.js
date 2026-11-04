import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  product: {
    name: { type: String, required: true },
    sku: { type: String, default: '' }
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: 'Approved',
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', reviewSchema);
export default Review;
