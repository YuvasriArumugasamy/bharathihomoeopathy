import Brand from '../models/Brand.js';
import Product from '../models/Product.js';

export const createBrand = async (req, res, next) => {
  try {
    const { name, slug, description, image, isActive, sortOrder } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Brand name is required' });
    }

    const brandSlug = slug ? slug.toLowerCase().trim() : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await Brand.findOne({ $or: [{ name: name.trim() }, { slug: brandSlug }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Brand already exists' });
    }

    const brand = await Brand.create({
      name: name.trim(),
      slug: brandSlug,
      description: description || '',
      image: image || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { slug: req.params.id };
    const brand = await Brand.findOne(query);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    const updated = await Brand.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { slug: req.params.id };
    const brand = await Brand.findOne(query);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    await Brand.findOneAndDelete(query);
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
