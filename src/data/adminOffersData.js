import { assets } from '../assets';

export const initialAdminOffers = [
  {
    id: "offer-clinic-1",
    name: "Dr. Bharathi Clinical Wellness Savings",
    description: "Special savings on doctor-formulated natural homeopathic remedies and daily wellness tonics.",
    type: "Percentage Discount",
    discountBadge: "10% to 20% OFF",
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    status: "Active",
    createdAt: "2026-09-01"
  },
  {
    id: "offer-clinic-2",
    name: "Pure Mother Tinctures Special",
    description: "Flat savings on pure SBL & Dr. Bharathi authentic clinical mother tinctures.",
    type: "Fixed Discount",
    discountBadge: "Flat ₹150 OFF",
    startDate: "2026-09-15",
    endDate: "2026-12-31",
    status: "Active",
    createdAt: "2026-09-15"
  }
];

export const initialAdminCoupons = [
  {
    id: "cpn-homecare10",
    code: "HOMECARE10",
    offerTitle: "Dr. Bharathi Welcome Special - 10% Off",
    productId: "HOM-102",
    productSku: "HOM-DHC-102",
    productImage: assets.product1,
    discountType: "Percentage",
    discountValue: 10,
    minimumOrderValue: 499,
    maximumDiscount: 200,
    usageLimit: 500,
    usedCount: 14,
    status: "Active",
    createdAt: "2026-09-01"
  },
  {
    id: "cpn-wellness20",
    code: "WELLNESS20",
    offerTitle: "Seasonal Clinical Wellness - 20% Off",
    productId: "prod-1",
    productSku: "HOM-SBL-001",
    productImage: assets.p1,
    discountType: "Percentage",
    discountValue: 20,
    minimumOrderValue: 999,
    maximumDiscount: 500,
    usageLimit: 300,
    usedCount: 28,
    status: "Active",
    createdAt: "2026-09-10"
  },
  {
    id: "cpn-flat150",
    code: "FLAT150",
    offerTitle: "Direct Dispensary Cart Voucher - Flat ₹150 Off",
    productId: "prod-2",
    productSku: "HOM-SBL-002",
    productImage: assets.p2,
    discountType: "Fixed",
    discountValue: 150,
    minimumOrderValue: 1200,
    maximumDiscount: 150,
    usageLimit: 200,
    usedCount: 19,
    status: "Active",
    createdAt: "2026-09-15"
  }
];
