export const initialAdminCustomers = [
  {
    id: "cust-1",
    customerId: "CUS-DEMO-001",
    firstName: "Ananya",
    lastName: "Sharma",
    email: "ananya.sharma@example.com",
    phone: "+91 98765 12340",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    status: "Active",
    joinedDate: "2026-06-15",
    ordersCount: 4,
    totalSpent: 4280,
    address: {
      addressLine1: "Flat 402, Green Meadows",
      addressLine2: "Outer Ring Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      country: "India"
    },
    orderHistory: [
      { orderId: "DEMO-1004", date: "2026-08-25", amount: 1199, paymentStatus: "Paid", orderStatus: "Processing" }
    ],
    activity: [
      { event: "Order #DEMO-1004 placed", time: "2026-08-25 09:30 AM" },
      { event: "Profile updated", time: "2026-08-10 02:15 PM" }
    ]
  },
  {
    id: "cust-2",
    customerId: "CUS-DEMO-002",
    firstName: "Karthik",
    lastName: "Raja",
    email: "karthik.r@example.com",
    phone: "+91 98401 22334",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    status: "Active",
    joinedDate: "2026-07-01",
    ordersCount: 2,
    totalSpent: 1496,
    address: {
      addressLine1: "15 Temple Street",
      addressLine2: "Mylapore",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600004",
      country: "India"
    },
    orderHistory: [
      { orderId: "DEMO-1003", date: "2026-08-24", amount: 748, paymentStatus: "Pending", orderStatus: "Pending" }
    ],
    activity: [
      { event: "Order #DEMO-1003 placed", time: "2026-08-24 04:10 PM" }
    ]
  },
  {
    id: "cust-3",
    customerId: "CUS-DEMO-003",
    firstName: "Meera",
    lastName: "Nambiar",
    email: "meera.n@example.com",
    phone: "+91 97455 88990",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    status: "Active",
    joinedDate: "2026-07-12",
    ordersCount: 3,
    totalSpent: 1850,
    address: {
      addressLine1: "28 Palm Grove Road",
      addressLine2: "Kaloor",
      city: "Kochi",
      state: "Kerala",
      pincode: "682017",
      country: "India"
    },
    orderHistory: [
      { orderId: "DEMO-1002", date: "2026-08-24", amount: 500, paymentStatus: "Paid", orderStatus: "Shipped" }
    ],
    activity: [
      { event: "Appointment completed", time: "2026-08-18 11:00 AM" }
    ]
  },
  {
    id: "cust-4",
    customerId: "CUS-DEMO-004",
    firstName: "Suresh",
    lastName: "Kumar",
    email: "suresh.k@example.com",
    phone: "+91 94441 55667",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    status: "Active",
    joinedDate: "2026-06-20",
    ordersCount: 5,
    totalSpent: 5620,
    address: {
      addressLine1: "74 Gandhipuram 4th Street",
      addressLine2: "",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641012",
      country: "India"
    },
    orderHistory: [
      { orderId: "DEMO-1001", date: "2026-08-23", amount: 1547, paymentStatus: "Paid", orderStatus: "Delivered" }
    ],
    activity: [
      { event: "Order #DEMO-1001 delivered", time: "2026-08-25 01:20 PM" }
    ]
  },
  {
    id: "cust-5",
    customerId: "CUS-DEMO-005",
    firstName: "Priya",
    lastName: "Sundaram",
    email: "priya.s@example.com",
    phone: "+91 99620 33445",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    status: "Blocked",
    joinedDate: "2026-05-18",
    ordersCount: 1,
    totalSpent: 949,
    address: {
      addressLine1: "12 Lake View Road",
      addressLine2: "KK Nagar",
      city: "Madurai",
      state: "Tamil Nadu",
      pincode: "625020",
      country: "India"
    },
    orderHistory: [
      { orderId: "DEMO-1000", date: "2026-08-22", amount: 949, paymentStatus: "Paid", orderStatus: "Delivered" }
    ],
    activity: [
      { event: "Account flagged for review", time: "2026-08-23 05:00 PM" }
    ]
  }
];
