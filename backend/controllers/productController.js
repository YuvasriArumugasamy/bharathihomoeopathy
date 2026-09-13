import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { validateProductInput } from '../validators/productValidator.js';
import { getEffectivePrice, getStockStatus } from '../utils/productUtils.js';

const normalizeProductPayload = async (body) => {
  const payload = { ...body };
  if (payload.regularPrice != null && payload.price == null) {
    payload.price = Number(payload.regularPrice);
  }
  if (payload.offerPrice != null && payload.salePrice == null) {
    payload.salePrice = Number(payload.offerPrice);
  }
  if (payload.image && (!payload.images || payload.images.length === 0)) {
    payload.images = [payload.image];
  }

  // If category is a name string instead of ObjectId
  if (payload.category && typeof payload.category === 'string') {
    if (!mongoose.Types.ObjectId.isValid(payload.category)) {
      let cat = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${payload.category.trim()}$`, 'i') } },
          { slug: payload.category.toLowerCase().replace(/[\s\W-]+/g, '-') }
        ]
      });
      if (!cat) {
        cat = await Category.create({
          name: payload.category.trim(),
          slug: payload.category.toLowerCase().replace(/[\s\W-]+/g, '-')
        });
      }
      payload.category = cat._id;
    }
  }
  return payload;
};

export const createProduct = async (req, res, next) => {
  try {
    const normalized = await normalizeProductPayload(req.body);
    const { isValid, errors } = validateProductInput(normalized);
    if (!isValid) return res.status(400).json({ success: false, message: errors.join(', ') });

    const { sku, name, slug } = normalized;
    const productSlug = slug ? slug.toLowerCase().trim() : name.toLowerCase().replace(/[\s\W-]+/g, '-');

    const skuExists = await Product.findOne({ sku: sku.trim() });
    if (skuExists) {
      return res.status(400).json({ success: false, message: 'SKU already exists' });
    }

    const slugExists = await Product.findOne({ slug: productSlug });
    if (slugExists) {
      return res.status(400).json({ success: false, message: 'Product slug already exists' });
    }

    const product = await Product.create({
      ...normalized,
      slug: productSlug,
      sku: sku.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (req.query.search) {
      const q = req.query.search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.minPrice != null || req.query.maxPrice != null) {
      query.price = {};
      if (req.query.minPrice != null) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice != null) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.featured === 'true') query.isFeatured = true;
    if (req.query.bestSeller === 'true') query.isBestSeller = true;

    // Sorting Whitelist
    let sortOptions = { createdAt: -1 };
    if (req.query.sort === 'priceLow') sortOptions = { price: 1 };
    else if (req.query.sort === 'priceHigh') sortOptions = { price: -1 };
    else if (req.query.sort === 'nameAZ') sortOptions = { name: 1 };
    else if (req.query.sort === 'nameZA') sortOptions = { name: -1 };
    else if (req.query.sort === 'newest') sortOptions = { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const enriched = products.map(p => {
      const obj = p.toObject();
      obj.effectivePrice = getEffectivePrice(obj);
      obj.stockStatus = getStockStatus(obj.stock, obj.lowStockThreshold);
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

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(limit);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getBestSellers = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isActive: true, isBestSeller: true })
      .populate('category', 'name slug')
      .limit(limit);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const obj = product.toObject();
    obj.effectivePrice = getEffectivePrice(obj);
    obj.stockStatus = getStockStatus(obj.stock, obj.lowStockThreshold);

    res.status(200).json({ success: true, data: obj });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const obj = product.toObject();
    obj.effectivePrice = getEffectivePrice(obj);
    obj.stockStatus = getStockStatus(obj.stock, obj.lowStockThreshold);

    res.status(200).json({ success: true, data: obj });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status === 'active') query.isActive = true;
    if (req.query.status === 'inactive') query.isActive = false;

    if (req.query.search) {
      const q = req.query.search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } }
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const enriched = products.map(p => {
      const obj = p.toObject();
      obj.id = obj._id;
      obj.regularPrice = obj.price;
      obj.offerPrice = obj.salePrice != null ? obj.salePrice : obj.price;
      obj.image = (obj.images && obj.images.length > 0) ? obj.images[0] : '';
      obj.category = (obj.category && obj.category.name) ? obj.category.name : (obj.category || 'General');
      obj.status = obj.isActive ? 'Active' : 'Inactive';
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

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const normalized = await normalizeProductPayload(req.body);

    if (normalized.sku && normalized.sku !== product.sku) {
      const skuExists = await Product.findOne({ sku: normalized.sku.trim() });
      if (skuExists) {
        return res.status(400).json({ success: false, message: 'SKU already exists' });
      }
    }

    if (normalized.slug && normalized.slug !== product.slug) {
      const slugExists = await Product.findOne({ slug: normalized.slug.toLowerCase().trim() });
      if (slugExists) {
        return res.status(400).json({ success: false, message: 'Product slug already exists' });
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, normalized, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};
