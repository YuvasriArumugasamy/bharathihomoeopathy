export const initialAdminReviews = [
  {
    id: "review-demo-1",
    customer: {
      name: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
    },
    product: {
      name: "Arnica Montana 30C",
      sku: "HOM-ARN-30C"
    },
    rating: 5,
    title: "Genuine quality preparation",
    content: "Clean, authentic homeopathic preparation delivered securely in amber vial. Very satisfied with the service.",
    status: "Approved",
    isFeatured: true,
    rejectionReason: "",
    createdAt: "2026-08-20"
  },
  {
    id: "review-demo-2",
    customer: {
      name: "Suresh Kumar",
      email: "suresh.k@example.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
    },
    product: {
      name: "Natural Herbal Immunity Wellness Drops",
      sku: "WEL-IMM-50ML"
    },
    rating: 5,
    title: "Very pure herbal taste and aroma",
    content: "Our entire family uses these seasonal wellness drops. Quality packaging and prompt delivery.",
    status: "Approved",
    isFeatured: true,
    rejectionReason: "",
    createdAt: "2026-08-21"
  },
  {
    id: "review-demo-3",
    customer: {
      name: "Karthik Raja",
      email: "karthik.r@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
    },
    product: {
      name: "Nux Vomica 200CH",
      sku: "HOM-NUX-200CH"
    },
    rating: 4,
    title: "Good packaging",
    content: "Delivered promptly without any damage. Bottle was sealed properly.",
    status: "Pending",
    isFeatured: false,
    rejectionReason: "",
    createdAt: "2026-08-24"
  },
  {
    id: "review-demo-4",
    customer: {
      name: "Ramesh B.",
      email: "ramesh.b@example.com",
      avatar: ""
    },
    product: {
      name: "Five Phos 6X",
      sku: "BIO-5PHOS-100G"
    },
    rating: 2,
    title: "Delivery delayed slightly",
    content: "Product is fine but courier took 4 days.",
    status: "Rejected",
    isFeatured: false,
    rejectionReason: "Review relates to external courier delay rather than product feedback.",
    createdAt: "2026-08-15"
  }
];

export const initialAdminEnquiries = [
  {
    id: "enq-1",
    enquiryId: "ENQ-DEMO-001",
    customer: {
      name: "Vandana Rao",
      email: "vandana.r@example.com",
      phone: "+91 98860 12345"
    },
    subject: "Availability of 200CH Potency Mother Tinctures",
    message: "Hello Dr. Bharathi Care team, are higher potencies available on request if prescribed?",
    type: "Product",
    priority: "Medium",
    status: "New",
    isRead: false,
    orderId: "",
    createdAt: "2026-08-25 10:30 AM",
    replies: []
  },
  {
    id: "enq-2",
    enquiryId: "ENQ-DEMO-002",
    customer: {
      name: "Dr. Arvind Nathan",
      email: "arvind.n@example.com",
      phone: "+91 94440 99887"
    },
    subject: "Online Consultation Slots for Weekend",
    message: "Do you have video consultation slots on Saturday evening for patients residing in Bangalore?",
    type: "Appointment",
    priority: "High",
    status: "In Progress",
    isRead: true,
    orderId: "",
    createdAt: "2026-08-24 03:15 PM",
    replies: [
      { id: "rep-1", sender: "Admin", message: "Hello Dr. Arvind, Saturday evening slots from 4:30 PM to 6:30 PM are available via video call.", createdAt: "2026-08-24 04:00 PM" }
    ]
  },
  {
    id: "enq-3",
    enquiryId: "ENQ-DEMO-003",
    customer: {
      name: "Manjula S.",
      email: "manjula.s@example.com",
      phone: "+91 97400 55661"
    },
    subject: "Order #DEMO-1002 Dispatch Tracking",
    message: "Could you please confirm if the tracking link for order 1002 has been generated?",
    type: "Order",
    priority: "Low",
    status: "Resolved",
    isRead: true,
    orderId: "DEMO-1002",
    createdAt: "2026-08-24 11:00 AM",
    replies: [
      { id: "rep-2", sender: "Admin", message: "Tracking details shared to registered email and SMS.", createdAt: "2026-08-24 11:30 AM" }
    ]
  }
];
