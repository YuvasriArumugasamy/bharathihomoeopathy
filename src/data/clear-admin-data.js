const fs = require('fs');
const path = require('path');

const dataDir = __dirname;

const files = [
  { name: 'adminAppointmentsData.js', content: 'export const initialAdminAppointments = [];\n' },
  { name: 'adminBlogData.js', content: 'export const initialAdminBlogs = [];\n' },
  { name: 'adminCategoriesData.js', content: 'export const initialAdminCategories = [];\n' },
  { name: 'adminCustomersData.js', content: 'export const initialAdminCustomers = [];\n' },
  { name: 'adminDashboardData.js', content: `export const adminDashboardData = {
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
};\n` },
  { name: 'adminInventoryData.js', content: 'export const initialAdminInventory = [];\n' },
  { name: 'adminOffersData.js', content: 'export const initialAdminOffers = [];\nexport const initialAdminCoupons = [];\n' },
  { name: 'adminOrdersData.js', content: 'export const initialAdminOrders = [];\n' },
  { name: 'adminPaymentsData.js', content: 'export const initialAdminPayments = [];\n' },
  { name: 'adminProductsData.js', content: 'export const initialAdminProducts = [];\n' },
  { name: 'adminReviewsData.js', content: 'export const initialAdminReviews = [];\n' },
  { name: 'adminSettingsData.js', content: `export const adminSettingsData = {
  general: {
    clinicName: "Dr. Bharathi's Homeopathy",
    email: "contact@bharathihomeo.com",
    phone: "+91 98765 43210",
    address: "123, Wellness Street, Health City",
    currency: "INR",
    timezone: "Asia/Kolkata"
  },
  seo: {
    metaTitle: "Dr. Bharathi's Homeo Care",
    metaDescription: "Natural Healing. Healthy Living.",
    keywords: "homeopathy, natural healing, health"
  }
};\n` },
  { name: 'adminEnquiriesData.js', content: 'export const initialAdminEnquiries = [];\n' }
];

files.forEach(f => {
  const p = path.join(dataDir, f.name);
  if (fs.existsSync(p) || f.name === 'adminEnquiriesData.js') {
    fs.writeFileSync(p, f.content);
    console.log('Cleared ' + f.name);
  }
});
