import mongoose from 'mongoose';

const enquiryReplySchema = new mongoose.Schema({
  sender: { type: String, default: 'Admin' },
  message: { type: String, required: true },
  sentAt: { type: String, default: () => new Date().toISOString() }
});

const enquirySchema = new mongoose.Schema({
  enquiryId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved', 'Closed'],
    default: 'New',
    index: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  replies: [enquiryReplySchema]
}, {
  timestamps: true
});

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
