export const adminDashboardData = {
  kpiStats: [
    { id: 'rev', title: 'Total Revenue', value: '₹48,920', change: '+14.2%', isPositive: true, subtext: 'vs last month', icon: 'IndianRupee' },
    { id: 'orders', title: 'Total Orders', value: '84', change: '+8.6%', isPositive: true, subtext: 'vs last month', icon: 'ShoppingBag' },
    { id: 'cust', title: 'Total Customers', value: '142', change: '+12.5%', isPositive: true, subtext: 'vs last month', icon: 'Users' },
    { id: 'apt', title: 'Appointments', value: '38', change: '+22.0%', isPositive: true, subtext: 'vs last month', icon: 'Calendar' },
    { id: 'pending_ord', title: 'Pending Orders', value: '6', change: '-2.1%', isPositive: true, subtext: 'needs processing', icon: 'Clock' },
    { id: 'low_stock', title: 'Low Stock Items', value: '3', change: '+1', isPositive: false, subtext: 'reorder soon', icon: 'AlertTriangle' },
    { id: 'enq', title: 'New Enquiries', value: '9', change: '+3', isPositive: true, subtext: 'unread messages', icon: 'MessageSquare' },
    { id: 'rev_rate', title: 'Average Rating', value: '4.85 / 5', change: '+0.1', isPositive: true, subtext: 'from 120 reviews', icon: 'Star' }
  ],
  salesData: {
    '7 Days': [
      { label: 'Mon', revenue: 4200, orders: 8 },
      { label: 'Tue', revenue: 5800, orders: 12 },
      { label: 'Wed', revenue: 3900, orders: 7 },
      { label: 'Thu', revenue: 7100, orders: 15 },
      { label: 'Fri', revenue: 8400, orders: 18 },
      { label: 'Sat', revenue: 9200, orders: 20 },
      { label: 'Sun', revenue: 6500, orders: 14 }
    ],
    '30 Days': [
      { label: 'Week 1', revenue: 18400, orders: 36 },
      { label: 'Week 2', revenue: 22100, orders: 42 },
      { label: 'Week 3', revenue: 26800, orders: 54 },
      { label: 'Week 4', revenue: 31200, orders: 62 }
    ],
    '90 Days': [
      { label: 'Month 1', revenue: 84000, orders: 160 },
      { label: 'Month 2', revenue: 96500, orders: 185 },
      { label: 'Month 3', revenue: 112000, orders: 215 }
    ]
  },
  orderStatusCounts: {
    pending: 6,
    confirmed: 12,
    processing: 14,
    shipped: 18,
    delivered: 30,
    cancelled: 4
  },
  recentOrders: [
    { id: 'DEMO-1004', customer: 'Ananya Sharma', amount: 1199, status: 'Processing', date: '2026-08-25', items: 2 },
    { id: 'DEMO-1003', customer: 'Karthik Raja', amount: 698, status: 'Pending', date: '2026-08-24', items: 2 },
    { id: 'DEMO-1002', customer: 'Meera Nambiar', amount: 450, status: 'Shipped', date: '2026-08-24', items: 1 },
    { id: 'DEMO-1001', customer: 'Suresh Kumar', amount: 1540, status: 'Delivered', date: '2026-08-23', items: 3 },
    { id: 'DEMO-1000', customer: 'Priya Sundaram', amount: 899, status: 'Delivered', date: '2026-08-22', items: 1 }
  ],
  topProducts: [
    { rank: 1, name: 'Arnica Montana 30C', unitsSold: 142, revenue: '₹49,558', stock: 28, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=100&q=80' },
    { rank: 2, name: 'Family Seasonal Wellness Combo', unitsSold: 98, revenue: '₹1,17,502', stock: 12, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=100&q=80' },
    { rank: 3, name: 'Nux Vomica 200CH', unitsSold: 88, revenue: '₹35,112', stock: 19, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=100&q=80' },
    { rank: 4, name: 'Berberis Aquifolium MT', unitsSold: 74, revenue: '₹36,260', stock: 16, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&q=80' },
    { rank: 5, name: 'Five Phos 6X Cell Salt', unitsSold: 62, revenue: '₹22,320', stock: 22, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=100&q=80' }
  ],
  lowStockItems: [
    { id: 'prod-11', name: 'Natural Arnica Herbal Hair Oil', currentStock: 0, threshold: 5, status: 'Out of Stock' },
    { id: 'prod-12', name: 'Herbal Digestive Support Combo', currentStock: 8, threshold: 10, status: 'Low Stock' },
    { id: 'prod-7', name: 'Family Seasonal Wellness Combo', currentStock: 12, threshold: 15, status: 'Low Stock' }
  ],
  todayAppointments: [
    { id: 'APT-101', time: '09:30 AM', patient: 'Rahul V.', type: 'Clinic Visit', doctor: 'Dr. Bharathi', status: 'Confirmed' },
    { id: 'APT-102', time: '11:00 AM', patient: 'Deepa M.', type: 'Online Consultation', doctor: 'Dr. Bharathi', status: 'Confirmed' },
    { id: 'APT-103', time: '04:30 PM', patient: 'Gopalakrishnan', type: 'Follow-up', doctor: 'Dr. Bharathi', status: 'Pending' }
  ],
  activities: [
    { id: 'act-1', icon: 'ShoppingBag', text: 'New order #DEMO-1004 received from Ananya S.', time: '10 mins ago' },
    { id: 'act-2', icon: 'Calendar', text: 'Appointment requested by Gopalakrishnan for 4:30 PM', time: '35 mins ago' },
    { id: 'act-3', icon: 'MessageSquare', text: 'New product enquiry received regarding Mother Tinctures', time: '1 hour ago' },
    { id: 'act-4', icon: 'Star', text: '5-star review submitted for Arnica Montana 30C', time: '2 hours ago' },
    { id: 'act-5', icon: 'CheckCircle', text: 'Payment of ₹1540 verified for order #DEMO-1001', time: '3 hours ago' }
  ],
  notifications: [
    { id: 'notif-1', title: 'New Order #DEMO-1004', description: 'Customer placed COD order for 2 items.', time: '10m ago', unread: true, category: 'Orders' },
    { id: 'notif-2', title: 'Appointment Request', description: 'Gopalakrishnan requested follow-up consultation.', time: '35m ago', unread: true, category: 'Appointments' },
    { id: 'notif-3', title: 'Stock Alert', description: 'Arnica Hair Oil reached 0 stock level.', time: '1h ago', unread: true, category: 'Inventory' },
    { id: 'notif-4', title: 'New Customer Enquiry', description: 'Enquiry received regarding shipping timelines.', time: '2h ago', unread: false, category: 'Enquiries' }
  ]
};
