import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { validateCategoryInput } from '../validators/categoryValidator.js';

export const createCategory = async (req, res, next) => {
  try {
    const { isValid, errors } = validateCategoryInput(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors.join(', ') });

    const { name, slug, description, image, sortOrder } = req.body;
    const categorySlug = slug ? slug.toLowerCase().trim() : name.toLowerCase().replace(/\s+/g, '-');

    const existing = await Category.findOne({ slug: categorySlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category slug already exists' });
    }

    const category = await Category.create({
      name,
      slug: categorySlug,
      description: description || '',
      image: image || '',
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });

    // Aggregate active product counts per category
    const productCounts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    productCounts.forEach(pc => {
      countMap[pc._id.toString()] = pc.count;
    });

    const enriched = categories.map(cat => ({
      ...cat.toObject(),
      productCount: countMap[cat._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: enriched
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (req.body.slug && req.body.slug !== category.slug) {
      const duplicate = await Category.findOne({ slug: req.body.slug.toLowerCase().trim() });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Category slug already exists' });
      }
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if products reference this category
    const productsCount = await Product.countDocuments({ category: category._id });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category because products are assigned to it'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
