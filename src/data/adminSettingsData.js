export const initialAdminSettings = {
  general: {
    siteTitle: "Dr. Bharathi’s Homeo Care",
    tagline: "Natural Healing. Healthy Living.",
    logoUrl: "",
    faviconUrl: "",
    timezone: "Asia/Kolkata (GMT+05:30)",
    dateFormat: "DD/MM/YYYY",
    currency: "INR (₹)"
  },
  clinic: {
    clinicName: "Dr. Bharathi’s Homeo Care & Wellness Clinic",
    registrationNumber: "REG-TN-HOMEO-2018-849",
    leadDoctor: "Dr. Bharathi",
    qualifications: "[Qualifications / Degrees]",
    experienceYears: "[Experience in Years]",
    primarySpecialty: "Classical Homeopathy & Constitutional Care"
  },
  contact: {
    phone: "+91 90258 54711",
    secondaryPhone: "090258 54711",
    whatsapp: "+91 90258 54711",
    email: "bharathihomoeopathy246@gmail.com",
    addressLine1: "Municipality complex, 143, Nethaji Rd",
    addressLine2: "Melapalayam",
    city: "Tirunelveli",
    state: "Tamil Nadu",
    pincode: "627005",
    country: "India",
    googleMapsEmbedUrl: ""
  },
  workingHours: {
    mondayFriday: "09:30 AM - 01:30 PM, 05:30 PM - 09:30 PM",
    saturday: "09:30 AM - 01:30 PM, 05:30 PM - 09:30 PM",
    sunday: "Closed"
  },
  store: {
    enableECommerce: true,
    catalogModeOnly: false,
    lowStockAlertThreshold: 5,
    outOfStockVisibility: "Show with badge",
    priceDisplayIncludesTax: true
  },
  orders: {
    orderPrefix: "DHC-",
    minOrderAmount: 0,
    allowGuestCheckout: false,
    autoConfirmPaidOrders: true,
    cancellationWindowHours: 24
  },
  appointments: {
    slotDurationMinutes: 30,
    allowOnlineBooking: true,
    allowVideoConsultation: true,
    maxAdvanceBookingDays: 30,
    autoConfirmation: false
  },
  payments: {
    enableCOD: true,
    enableRazorpay: true,
    razorpayKeyId: "rzp_test_demoKey123",
    razorpayKeySecret: "••••••••••••••••",
    testMode: true
  },
  shipping: {
    standardShippingFee: 50,
    freeShippingThreshold: 1000,
    expressShippingFee: 120,
    enableLocalPickup: true
  },
  tax: {
    enableTax: false,
    taxRatePercentage: 0,
    gstinNumber: "33AAAAA0000A1Z5"
  },
  notifications: {
    emailOrderConfirmation: true,
    emailAppointmentAlerts: true,
    adminOrderAlertEmail: "admin@drbharathihomeocare.com",
    smsCustomerUpdates: true,
    whatsappAlerts: true
  },
  smtp: {
    smtpHost: "smtp.mailgun.org",
    smtpPort: 587,
    smtpUser: "notifications@drbharathihomeocare.com",
    smtpPassword: "••••••••••••",
    fromName: "Dr. Bharathi’s Homeo Care",
    fromEmail: "noreply@drbharathihomeocare.com"
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://www.instagram.com/_drbharathi",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
    whatsappChannel: "https://whatsapp.com"
  },
  appearance: {
    primaryThemeColor: "#0f2438",
    accentColor: "#ea6108",
    fontFamily: "Outfit, Inter",
    headerStyle: "Modern Clean with Topbar"
  },
  security: {
    enableTwoFactorForAdmin: false,
    adminSessionTimeoutMinutes: 60,
    maxFailedLoginAttempts: 5
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "We are briefly updating our clinic platform. We will be back online shortly."
  }
};
