import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  excerpt: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General Homeopathy'
  },
  tags: [{
    type: String
  }],
  author: {
    name: { type: String, default: 'Dr. Bharathi' },
    role: { type: String, default: 'Chief Homeopathic Physician' },
    avatar: { type: String, default: '' }
  },
  coverImage: {
    type: String,
    default: ''
  },
  readTime: {
    type: String,
    default: '4 min read'
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Published',
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  publishDate: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10)
  }
}, {
  timestamps: true
});

export const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
