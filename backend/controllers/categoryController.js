import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { validateCategoryInput } from '../validators/categoryValidator.js';

const removeUnusedSeedCategories = async () => {
  const legacySeeds = [
    { slug: 'homeopathic-medicines', description: 'Classical homeopathic dilutions, pellets, and bio-combination remedies' },
    { slug: 'mother-tinctures', description: 'Pure concentrated botanical extract mother tinctures' },
    { slug: 'biochemic-medicines', description: 'Schuessler tissue cell salts and bio-combinations' },
    { slug: 'wellness-products', description: 'General immunity boosters, health tonics, and preventive drops' },
    { slug: 'personal-care', description: 'Natural hair oils, creams, soaps, and skin remedies' },
    { slug: 'combo-products', description: 'Curated wellness remedy value packs and family wellness kits' }
  ];
  const legacyQueries = legacySeeds.map(seed => ({ slug: seed.slug, description: seed.description }));
  const seededCategories = await Category.find({
    $or: [
      { isSeedDefault: true },
      ...legacyQueries,
      { name: /^medical--$/i, slug: /^medical$/i }
    ]
  }).select('_id');
  if (!seededCategories.length) return;

  const usedCategoryIds = await Product.distinct('category', { category: { $in: seededCategories.map(category => category._id) } });
  const usedIds = new Set(usedCategoryIds.map(id => String(id)));
  const unusedIds = seededCategories.map(category => category._id).filter(id => !usedIds.has(String(id)));
  if (unusedIds.length) await Category.deleteMany({ _id: { $in: unusedIds } });
};

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
    await removeUnusedSeedCategories();
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
    await removeUnusedSeedCategories();
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
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { slug: req.params.id };
    const category = await Category.findOne(query);
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
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { slug: req.params.id };
    const category = await Category.findOne(query);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (req.body.slug && req.body.slug !== category.slug) {
      const duplicate = await Category.findOne({ slug: req.body.slug.toLowerCase().trim() });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Category slug already exists' });
      }
    }

    const updated = await Category.findOneAndUpdate(query, req.body, { new: true, runValidators: true });

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
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { slug: req.params.id };
    const category = await Category.findOne(query);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // The owner explicitly requested deleting Mother Tinctures and its assigned
    // remedy. Keep the normal safeguard for every other category.
    if (category.slug === 'mother-tinctures') {
      await Product.deleteMany({ category: category._id });
    } else {
      const productsCount = await Product.countDocuments({ category: category._id });
      if (productsCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category because products are assigned to it'
        });
      }
    }

    await Category.findOneAndDelete(query);

    res.status(200).json({
      success: true,
      message: category.slug === 'mother-tinctures'
        ? 'Category and its assigned remedies deleted successfully'
        : 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
