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

export const initialInventoryHistory = [
  {
    id: "inv-hist-1",
    productId: "prod-1",
    productName: "Arnica Montana 30C",
    sku: "HOM-ARN-30C",
    adjustmentType: "Add Stock",
    quantity: 15,
    previousStock: 13,
    newStock: 28,
    reason: "New stock received from certified dispensary",
    createdAt: "2026-08-25 10:15 AM"
  },
  {
    id: "inv-hist-2",
    productId: "prod-11",
    productName: "Natural Arnica Herbal Hair Oil",
    sku: "PER-ARN-100ML",
    adjustmentType: "Set Stock",
    quantity: 0,
    previousStock: 4,
    newStock: 0,
    reason: "Manual correction / batch exhausted",
    createdAt: "2026-08-24 03:40 PM"
  },
  {
    id: "inv-hist-3",
    productId: "prod-7",
    productName: "Complete Family Seasonal Wellness Combo",
    sku: "CMB-FAM-001",
    adjustmentType: "Remove Stock",
    quantity: 2,
    previousStock: 14,
    newStock: 12,
    reason: "Damaged item / seal check",
    createdAt: "2026-08-23 11:20 AM"
  }
];
