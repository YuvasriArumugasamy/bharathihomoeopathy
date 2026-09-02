export const mockAccountData = {
  customer: {
    name: "[Customer Name]",
    email: "customer@example.com",
    phone: "+91 98765 43210",
    dob: "1992-05-15",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    joinedDate: "2026-06-10"
  },
  stats: {
    totalOrders: 3,
    activeOrders: 1,
    appointments: 1,
    wishlist: 4
  },
  recentOrders: [
    {
      id: "DEMO-1001",
      date: "2026-08-20",
      items: "Arnica Montana 30C + 1 more",
      itemsCount: 2,
      amount: 748,
      status: "Processing"
    },
    {
      id: "DEMO-1000",
      date: "2026-08-10",
      items: "Family Seasonal Wellness Combo",
      itemsCount: 1,
      amount: 1199,
      status: "Delivered"
    },
    {
      id: "DEMO-0995",
      date: "2026-07-25",
      items: "Five Phos 6X",
      itemsCount: 1,
      amount: 360,
      status: "Delivered"
    }
  ],
  upcomingAppointment: {
    doctor: "Dr. Bharathi",
    date: "2026-08-28",
    time: "10:00 AM",
    type: "Clinic Visit",
    status: "Requested",
    notes: "General seasonal wellness consultation"
  },
  savedAddress: {
    fullName: "Customer Name",
    phone: "+91 98765 43210",
    addressLine1: "123 Healthcare Avenue, 2nd Cross",
    addressLine2: "Near City Botanical Garden",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    country: "India"
  },
  settings: {
    emailNotifications: true,
    orderUpdates: true,
    appointmentReminders: true,
    promotionalUpdates: false
  }
};
