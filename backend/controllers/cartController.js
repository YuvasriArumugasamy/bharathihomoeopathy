import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { validateAddToCart, validateUpdateCart } from '../validators/cartValidator.js';
import { getEffectivePrice } from '../utils/productUtils.js';
import { calculateCartTotals } from '../utils/cartUtils.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug sku images price salePrice stock lowStockThreshold isActive'
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        subtotal: 0,
        totalItems: 0
      });
      return res.status(200).json({ success: true, data: cart });
    }

    // Filter out inactive products and validate stock/price live
    let itemsChanged = false;
    const validatedItems = [];

    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        itemsChanged = true;
        continue;
      }

      const effectivePrice = getEffectivePrice(item.product);
      if (item.price !== effectivePrice) {
        item.price = effectivePrice;
        itemsChanged = true;
      }

      validatedItems.push(item);
    }

    if (itemsChanged) {
      cart.items = validatedItems;
      const { subtotal, totalItems } = calculateCartTotals(cart.items);
      cart.subtotal = subtotal;
      cart.totalItems = totalItems;
      await cart.save();
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { isValid, errors } = validateAddToCart(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors.join(', ') });

    const { productId, quantity } = req.body;

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or inactive' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} units available in dispensary` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const effectivePrice = getEffectivePrice(product);
    const existingIndex = cart.items.findIndex(i => i.product.toString() === productId.toString());

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Dispensary maximum stock is ${product.stock}`
        });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = effectivePrice;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: effectivePrice
      });
    }

    const { subtotal, totalItems } = calculateCartTotals(cart.items);
    cart.subtotal = subtotal;
    cart.totalItems = totalItems;

    await cart.save();

    const populated = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug sku images price salePrice stock isActive'
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { isValid, errors } = validateUpdateCart(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors.join(', ') });

    const { quantity } = req.body;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      cart.items.pull(itemId);
      const { subtotal, totalItems } = calculateCartTotals(cart.items);
      cart.subtotal = subtotal;
      cart.totalItems = totalItems;
      await cart.save();
      return res.status(400).json({ success: false, message: 'Product is no longer available' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} units available in stock` });
    }

    item.quantity = Number(quantity);
    item.price = getEffectivePrice(product);

    const { subtotal, totalItems } = calculateCartTotals(cart.items);
    cart.subtotal = subtotal;
    cart.totalItems = totalItems;

    await cart.save();

    const populated = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug sku images price salePrice stock isActive'
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    const { subtotal, totalItems } = calculateCartTotals(cart.items);
    cart.subtotal = subtotal;
    cart.totalItems = totalItems;

    await cart.save();

    const populated = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug sku images price salePrice stock isActive'
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      cart.totalItems = 0;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart || { user: req.user._id, items: [], subtotal: 0, totalItems: 0 }
    });
  } catch (error) {
    next(error);
  }
};
