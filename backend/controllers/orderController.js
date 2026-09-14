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

    const {
      shippingAddress,
      paymentMethod = 'COD',
      notes = '',
      discount = 0,
      items: directItems,
      orderNumber: customOrderNumber,
      guestEmail,
      guestName,
      guestPhone
    } = req.body;

    let itemsSource = [];

    if (Array.isArray(directItems) && directItems.length > 0) {
      itemsSource = directItems;
    } else if (req.user) {
      const cart = await Cart.findOne({ user: req.user._id });
      if (cart && cart.items.length > 0) {
        itemsSource = cart.items;
      }
    }

    if (!itemsSource || itemsSource.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Add products before placing order.' });
    }

    const orderItems = [];
    let calculatedSubtotal = 0;

    for (const item of itemsSource) {
      const productId = item.product || item.id || item._id;
      let name = item.name || item.title || 'Homeopathic Medicine';
      let sku = item.sku || '';
      let image = item.image || (Array.isArray(item.images) ? item.images[0] : '') || '';
      let price = Number(item.price || item.salePrice || item.effectivePrice || 0);
      const quantity = Number(item.quantity || 1);

      // Attempt DB lookup if productId is a valid 24-char hex mongo ObjectId
      if (productId && typeof productId === 'string' && /^[0-9a-fA-F]{24}$/.test(productId)) {
        const product = await Product.findOne({ _id: productId });
        if (product) {
          name = product.name;
          sku = product.sku || sku;
          image = (product.images && product.images[0]) || image;
          price = getEffectivePrice(product);
          if (product.stock >= quantity) {
            product.stock -= quantity;
            await product.save().catch(() => {});
          }
        }
      }

      const itemSubtotal = price * quantity;
      calculatedSubtotal += itemSubtotal;

      orderItems.push({
        product: productId,
        name,
        sku,
        image,
        quantity,
        price,
        itemSubtotal
      });
    }

    const shippingCharge = req.body.shippingCharge !== undefined
      ? Number(req.body.shippingCharge)
      : calculateShippingCharge(calculatedSubtotal);
    const subtotal = req.body.subtotal !== undefined ? Number(req.body.subtotal) : calculatedSubtotal;
    const totalAmount = req.body.totalAmount !== undefined
      ? Number(req.body.totalAmount)
      : calculateOrderTotal(subtotal, shippingCharge, Number(discount) || 0);

    const order = await Order.create({
      user: req.user ? req.user._id : null,
      guestId: req.body.guestId || '',
      guestEmail: guestEmail || shippingAddress?.email || (req.user ? req.user.email : ''),
      guestName: guestName || shippingAddress?.fullName || (req.user ? req.user.name : ''),
      guestPhone: guestPhone || shippingAddress?.phone || (req.user ? req.user.phone : ''),
      orderNumber: customOrderNumber || generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCharge,
      discount: Number(discount) || 0,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : (req.body.paymentStatus || 'pending'),
      orderStatus: req.body.orderStatus || 'pending',
      notes
    });

    // Clear cart if user had one
    if (req.user) {
      const cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = [];
        cart.subtotal = 0;
        cart.totalItems = 0;
        await cart.save().catch(() => {});
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully and recorded in MongoDB',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const query = {};
    if (req.user) {
      query.$or = [
        { user: req.user._id },
        { guestEmail: (req.user.email || '').toLowerCase() },
        { 'shippingAddress.email': (req.user.email || '').toLowerCase() }
      ];
    } else if (req.query.email) {
      query.$or = [
        { guestEmail: req.query.email.trim().toLowerCase() },
        { 'shippingAddress.email': req.query.email.trim().toLowerCase() }
      ];
    } else {
      return res.status(200).json({ success: true, data: [] });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
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
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const order = await Order.findOne(isMongoId ? { _id: req.params.id } : { $or: [{ orderNumber: req.params.id }, { id: req.params.id }] });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Security check: only the owner or an admin can view the order
    if (order.user && req.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const order = await Order.findOne(isMongoId ? { _id: req.params.id } : { $or: [{ orderNumber: req.params.id }, { id: req.params.id }] });

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
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const order = await Order.findOne(isMongoId ? { _id: req.params.id } : { $or: [{ orderNumber: req.params.id }, { id: req.params.id }] });

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
