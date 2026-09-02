import { demoProducts } from './products';

export const LOW_STOCK_THRESHOLD = 5;

export const initialAdminProducts = demoProducts.map((p, idx) => ({
  id: p.id,
  name: p.name,
  sku: p.sku,
  category: p.category,
  shortDescription: p.shortDescription,
  description: p.description,
  regularPrice: p.originalPrice || p.price,
  offerPrice: p.salePrice || p.price,
  stock: p.stock,
  lowStockThreshold: p.lowStockThreshold || 5,
  brand: "Dr. Bharathi's Standard",
  tags: ["Homeopathy", p.category],
  image: p.image,
  status: p.stock > 0 ? "Active" : (idx % 2 === 0 ? "Out of Stock" : "Draft"),
  isBestSeller: p.isBestSeller,
  isFeatured: p.isNew || p.isBestSeller,
  seoTitle: `${p.name} | Dr. Bharathi’s Homeo Care`,
  seoDescription: p.shortDescription,
  seoKeywords: ["homeopathy", p.name.toLowerCase()],
  slug: p.slug,
  createdAt: p.createdAt
}));
