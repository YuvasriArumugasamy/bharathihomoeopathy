import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: '',
    index: true
  },
  phone: {
    type: String,
    required: true,
    index: true
  },
  city: {
    type: String,
    default: 'Chennai'
  },
  state: {
    type: String,
    default: 'Tamil Nadu'
  },
  ordersCount: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Lead'],
    default: 'Active',
    index: true
  },
  joinedDate: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10)
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
