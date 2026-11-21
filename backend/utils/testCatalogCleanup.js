import Product from '../models/Product.js';
import Category from '../models/Category.js';

const junkPattern = /^(?:test|demo|sample|dummy)(?:\b|[-_\s])/i;

const junkTextQuery = [
  { name: /^mn$/i },
  { slug: /^mn$/i },
  { name: junkPattern },
  { slug: junkPattern }
];

export const removeLegacyTestCatalog = async () => {
  const junkCategories = await Category.find({
    $or: [
      { name: /^kjds$/i },
      { slug: /^kjds$/i },
      { name: junkPattern },
      { slug: junkPattern }
    ]
  }).select('_id');

  const categoryIds = junkCategories.map((category) => category._id);
  const productQuery = categoryIds.length
    ? { $or: [...junkTextQuery, { category: { $in: categoryIds } }] }
    : { $or: junkTextQuery };

  const productsResult = await Product.deleteMany(productQuery);
  const categoriesResult = await Category.deleteMany({ _id: { $in: categoryIds } });

  return {
    deletedProducts: productsResult.deletedCount || 0,
    deletedCategories: categoriesResult.deletedCount || 0
  };
};

export const isLegacyTestProduct = (product = {}) => {
  const isJunkName = (value = '') => /^mn$/i.test(String(value).trim()) || junkPattern.test(String(value).trim());
  const categoryName = typeof product.category === 'string' ? product.category : product.category?.name;
  const categorySlug = product.category?.slug;
  return isJunkName(product.name) || isJunkName(product.slug) || isJunkName(categoryName) || isJunkName(categorySlug) ||
    /^kjds$/i.test(String(categoryName || '').trim()) || /^kjds$/i.test(String(categorySlug || '').trim());
};
