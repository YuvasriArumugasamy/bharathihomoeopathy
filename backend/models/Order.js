import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  sku: { type: String, default: '' },
  image: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  itemSubtotal: { type: Number, required: true }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  shippingCharge: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'ONLINE'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentProvider: {
    type: String,
    default: 'razorpay'
  },
  razorpayOrderId: {
    type: String,
    default: ''
  },
  razorpayPaymentId: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
export default Order;
