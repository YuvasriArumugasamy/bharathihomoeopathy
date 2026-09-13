import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { validateOrderInput } from '../validators/orderValidator.js';
import { getEffectivePrice } from '../utils/productUtils.js';
import { generateOrderNumber, calculateShippingCharge, calculateOrderTotal, validateStatusTransition } from '../utils/orderUtils.js';

export const createOrder = async (req, res, next) => {
  try {
    const { isValid, errors } = validateOrderInput(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors.join(', ') });

    const { shippingAddress, paymentMethod = 'COD', notes = '', discount = 0 } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Add products before placing order.' });
    }

    const orderItems = [];
    let calculatedSubtotal = 0;

    // Validate each item directly from MongoDB Product source of truth
    for (const item of cart.items) {
      const product = await Product.findOne({ _id: item.product, isActive: true });
      if (!product) {
        return res.status(400).json({ success: false, message: 'One or more items in your cart are no longer available' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} left in dispensary.`
        });
      }

      const price = getEffectivePrice(product);
      const itemSubtotal = price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        image: (product.images && product.images[0]) || '',
        quantity: item.quantity,
        price,
        itemSubtotal
      });

      // Deduct stock safely
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingCharge = calculateShippingCharge(calculatedSubtotal);
    const totalAmount = calculateOrderTotal(calculatedSubtotal, shippingCharge, Number(discount) || 0);

    const order = await Order.create({
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      subtotal: calculatedSubtotal,
      shippingCharge,
      discount: Number(discount) || 0,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
      orderStatus: 'pending',
      notes
    });

    // Clear user's cart on successful order placement
    cart.items = [];
    cart.subtotal = 0;
    cart.totalItems = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Security check: only the owner or an admin can view the order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.orderStatus = req.query.status;
    if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const enriched = orders.map(o => {
      const obj = o.toObject();
      obj.id = obj._id;
      obj.orderId = obj.orderNumber;
      obj.total = obj.totalAmount;
      obj.customer = {
        name: obj.shippingAddress?.fullName || obj.user?.name || 'Walk-in / Online Patient',
        phone: obj.shippingAddress?.phone || obj.user?.phone || '+91 98765 43210',
        email: obj.shippingAddress?.email || obj.user?.email || 'patient@drbharathi.com',
        city: obj.shippingAddress?.city || 'Chennai'
      };
      // Capitalize status for frontend UI components
      obj.orderStatus = obj.orderStatus ? (obj.orderStatus.charAt(0).toUpperCase() + obj.orderStatus.slice(1)) : 'Pending';
      obj.paymentStatus = obj.paymentStatus ? (obj.paymentStatus.charAt(0).toUpperCase() + obj.paymentStatus.slice(1)) : 'Pending';
      return obj;
    });

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const rawStatus = (req.body.orderStatus || req.body.status || '').toLowerCase();
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = rawStatus;
    if (rawStatus === 'delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${rawStatus}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const rawPayment = (req.body.paymentStatus || '').toLowerCase();
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = rawPayment;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${rawPayment}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
