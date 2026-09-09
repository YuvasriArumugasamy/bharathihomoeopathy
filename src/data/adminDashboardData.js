export const adminDashboardData = {
  kpiStats: [
    { id: 'rev', title: 'Total Revenue', value: '₹0', change: '0%', isPositive: true, subtext: 'vs last month', icon: 'IndianRupee' },
    { id: 'orders', title: 'Total Orders', value: '0', change: '0%', isPositive: true, subtext: 'vs last month', icon: 'ShoppingBag' },
    { id: 'cust', title: 'Total Customers', value: '0', change: '0%', isPositive: true, subtext: 'vs last month', icon: 'Users' },
    { id: 'apt', title: 'Appointments', value: '0', change: '0%', isPositive: true, subtext: 'vs last month', icon: 'Calendar' },
    { id: 'pending_ord', title: 'Pending Orders', value: '0', change: '0%', isPositive: true, subtext: 'needs processing', icon: 'Clock' },
    { id: 'low_stock', title: 'Low Stock Items', value: '0', change: '0', isPositive: false, subtext: 'reorder soon', icon: 'AlertTriangle' },
    { id: 'enq', title: 'New Enquiries', value: '0', change: '0', isPositive: true, subtext: 'unread messages', icon: 'MessageSquare' },
    { id: 'rev_rate', title: 'Average Rating', value: '0.0 / 5', change: '0', isPositive: true, subtext: 'from 0 reviews', icon: 'Star' }
  ],
  salesData: {
    '7 Days': [],
    '30 Days': [],
    '90 Days': []
  },
  orderStatusCounts: { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
  recentOrders: [],
  topProducts: [],
  lowStockItems: [],
  todayAppointments: [],
  activities: [],
  notifications: []
};
