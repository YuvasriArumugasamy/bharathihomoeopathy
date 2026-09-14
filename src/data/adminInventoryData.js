import { demoProducts } from './products';

export const initialAdminInventory = demoProducts.map((p, index) => {
  const reserved = index % 3 === 0 ? 2 : 0;
  return {
    id: `inv-${p.id}`,
    productId: p.id,
    productName: p.name,
    sku: p.sku,
    category: p.category,
    image: p.image,
    currentStock: p.stock,
    reservedStock: reserved,
    availableStock: Math.max(0, p.stock - reserved),
    lowStockThreshold: p.lowStockThreshold || 5,
    costPrice: Math.round(p.price * 0.55),
    productStatus: p.stock > 0 ? "Active" : "Draft",
    lastUpdated: "2026-08-25"
  };
});

export const initialInventoryHistory = [];
