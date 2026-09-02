export const initialGlobalSeo = {
  metaTitle: "Dr. Bharathi’s Homeo Care | Natural Healing. Healthy Living.",
  metaDescription: "Personalised homeopathic consultation and certified wellness products for you and your family.",
  keywords: "homeopathy clinic, homeopathic doctor, natural wellness products, Dr Bharathi Homeo Care",
  canonicalUrl: "https://drbharathihomeocare.com",
  robotsIndex: true,
  robotsFollow: true,
  sitemapEnabled: true,
  sitemapUrl: "https://drbharathihomeocare.com/sitemap.xml",
  robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout/\nDisallow: /my-account/\nSitemap: https://drbharathihomeocare.com/sitemap.xml`,
  socialShare: {
    ogTitle: "Dr. Bharathi’s Homeo Care | Holistic Health & Homeopathy",
    ogDescription: "Personalised care, natural homeopathic remedies, and trusted clinical guidance.",
    ogImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    twitterCard: "summary_large_image"
  }
};

export const initialPageSeoList = [
  { id: "page-1", pageName: "Home", route: "/", metaTitle: "Dr. Bharathi’s Homeo Care | Natural Healing & Wellness", metaDescription: "Discover personalised homeopathic consultations and pure wellness remedies.", focusKeyword: "homeopathy clinic", score: 94, status: "Good" },
  { id: "page-2", pageName: "About Us", route: "/about", metaTitle: "About Dr. Bharathi | Clinic Story & Holistic Philosophy", metaDescription: "Learn about Dr. Bharathi's clinical practice and commitment to natural healing.", focusKeyword: "Dr Bharathi Homeopathy", score: 90, status: "Good" },
  { id: "page-3", pageName: "Shop", route: "/shop", metaTitle: "Shop Homeopathic Medicines & Wellness Formulations", metaDescription: "Browse verified homeopathic dilutions, mother tinctures, and tissue salts.", focusKeyword: "buy homeopathic medicines", score: 88, status: "Good" },
  { id: "page-4", pageName: "Doctor Appointment", route: "/appointment", metaTitle: "Book Homeopathic Consultation | Clinic & Online Visit", metaDescription: "Schedule your individualised homeopathic consultation in clinic or via video.", focusKeyword: "book homeopathy appointment", score: 92, status: "Good" },
  { id: "page-5", pageName: "Blog", route: "/blog", metaTitle: "Homeopathy & Wellness Health Journal | Educational Articles", metaDescription: "Read expert articles on lifestyle, biochemic cell salts, and family wellness.", focusKeyword: "homeopathy blog", score: 86, status: "Good" },
  { id: "page-6", pageName: "Contact Us", route: "/contact", metaTitle: "Contact Dr. Bharathi’s Homeo Care | Clinic Hours & Location", metaDescription: "Get clinic directions, working hours, and direct doctor appointment enquiry.", focusKeyword: "homeopathy clinic contact", score: 89, status: "Good" }
];
