export const initialAdminOrders = [
  {
    id: "demo-order-1",
    orderId: "DEMO-1004",
    customer: {
      name: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      phone: "+91 98765 12340"
    },
    items: [
      { name: "Family Seasonal Wellness Combo", sku: "CMB-FAM-001", quantity: 1, price: 1199, subtotal: 1199 }
    ],
    subtotal: 1199,
    discount: 0,
    deliveryCharge: 0,
    tax: 0,
    total: 1199,
    paymentMethod: "Online Payment",
    paymentStatus: "Paid",
    transactionId: "pay_test_948291",
    orderStatus: "Processing",
    shippingAddress: {
      addressLine1: "Flat 402, Green Meadows",
      addressLine2: "Outer Ring Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      country: "India"
    },
    orderNotes: "Please deliver during weekday morning hours.",
    createdAt: "2026-08-25"
  },
  {
    id: "demo-order-2",
    orderId: "DEMO-1003",
    customer: {
      name: "Karthik Raja",
      email: "karthik.r@example.com",
      phone: "+91 98401 22334"
    },
    items: [
      { name: "Arnica Montana 30C", sku: "HOM-ARN-30C", quantity: 2, price: 349, subtotal: 698 }
    ],
    subtotal: 698,
    discount: 0,
    deliveryCharge: 50,
    tax: 0,
    total: 748,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    transactionId: "",
    orderStatus: "Pending",
    shippingAddress: {
      addressLine1: "15 Temple Street",
      addressLine2: "Mylapore",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600004",
      country: "India"
    },
    orderNotes: "",
    createdAt: "2026-08-24"
  },
  {
    id: "demo-order-3",
    orderId: "DEMO-1002",
    customer: {
      name: "Meera Nambiar",
      email: "meera.n@example.com",
      phone: "+91 97455 88990"
    },
    items: [
      { name: "Echinacea Purpurea Mother Tincture", sku: "MT-ECH-30ML", quantity: 1, price: 450, subtotal: 450 }
    ],
    subtotal: 450,
    discount: 0,
    deliveryCharge: 50,
    tax: 0,
    total: 500,
    paymentMethod: "Online Payment",
    paymentStatus: "Paid",
    transactionId: "pay_test_774120",
    orderStatus: "Shipped",
    shippingAddress: {
      addressLine1: "28 Palm Grove Road",
      addressLine2: "Kaloor",
      city: "Kochi",
      state: "Kerala",
      pincode: "682017",
      country: "India"
    },
    orderNotes: "",
    createdAt: "2026-08-24"
  },
  {
    id: "demo-order-4",
    orderId: "DEMO-1001",
    customer: {
      name: "Suresh Kumar",
      email: "suresh.k@example.com",
      phone: "+91 94441 55667"
    },
    items: [
      { name: "Natural Herbal Immunity Wellness Drops", sku: "WEL-IMM-50ML", quantity: 2, price: 599, subtotal: 1198 },
      { name: "Arnica Montana 30C", sku: "HOM-ARN-30C", quantity: 1, price: 349, subtotal: 349 }
    ],
    subtotal: 1547,
    discount: 0,
    deliveryCharge: 0,
    tax: 0,
    total: 1547,
    paymentMethod: "Online Payment",
    paymentStatus: "Paid",
    transactionId: "pay_test_661902",
    orderStatus: "Delivered",
    shippingAddress: {
      addressLine1: "74 Gandhipuram 4th Street",
      addressLine2: "",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641012",
      country: "India"
    },
    orderNotes: "",
    createdAt: "2026-08-23"
  },
  {
    id: "demo-order-5",
    orderId: "DEMO-1000",
    customer: {
      name: "Priya Sundaram",
      email: "priya.s@example.com",
      phone: "+91 99620 33445"
    },
    items: [
      { name: "Herbal Digestive Support Wellness Combo", sku: "CMB-DIG-002", quantity: 1, price: 899, subtotal: 899 }
    ],
    subtotal: 899,
    discount: 0,
    deliveryCharge: 50,
    tax: 0,
    total: 949,
    paymentMethod: "Online Payment",
    paymentStatus: "Paid",
    transactionId: "pay_test_550219",
    orderStatus: "Delivered",
    shippingAddress: {
      addressLine1: "12 Lake View Road",
      addressLine2: "KK Nagar",
      city: "Madurai",
      state: "Tamil Nadu",
      pincode: "625020",
      country: "India"
    },
    orderNotes: "",
    createdAt: "2026-08-22"
  }
];
