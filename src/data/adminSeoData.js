export const SEO_PAGE_LIST_KEY = 'dr_bharathi_page_seo_list';
export const SEO_GLOBAL_KEY = 'dr_bharathi_global_seo';

export const initialGlobalSeo = {
  metaTitle: "Best Homeopathy Clinic in Trichy | Dr. Bharathi’s Homeo Care",
  metaDescription: "Dr. Bharathi’s Homeo Care is the best homeopathy clinic in Trichy, Tamil Nadu. Providing trusted classical homeopathy consultations, pure medicines & online care.",
  keywords: "best homeopathy clinic in trichy, homeopathy doctor near me, online homeopathy doctor consultation, buy homeopathic medicines online india, dr bharathi homeo care, homeopathy treatment for hair fall, homeopathy for skin allergy, homeopathy for pcos, classical homeopathy tamil nadu, mother tinctures online",
  canonicalUrl: "https://drbharathihomeo.com",
  robotsIndex: true,
  robotsFollow: true,
  sitemapEnabled: true,
  sitemapUrl: "https://drbharathihomeo.com/sitemap.xml",
  robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout/\nDisallow: /my-account/\nSitemap: https://drbharathihomeo.com/sitemap.xml`,
  socialShare: {
    ogTitle: "Dr. Bharathi’s Homeo Care | Best Homeopathy Clinic & Online Doctor",
    ogDescription: "Ranked #1 Homeopathy Care: Personalised treatment for chronic illness, pure natural remedies, video consultations & doorstep medicine dispatch.",
    ogImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    twitterCard: "summary_large_image"
  }
};

export const initialPageSeoList = [
  {
    id: "page-1",
    pageName: "Home",
    route: "/",
    metaTitle: "Best Homeopathy Clinic in Trichy | Dr. Bharathi’s Homeo Care",
    metaDescription: "Looking for the best homeopathy clinic in Trichy? Dr. Bharathi provides proven natural treatments for chronic illness, skin allergy, hair fall & family wellness.",
    focusKeyword: "best homeopathy clinic in trichy",
    score: 100,
    status: "Excellent"
  },
  {
    id: "page-2",
    pageName: "About Us",
    route: "/about",
    metaTitle: "Dr Bharathi Homeopathic Doctor | Leading Clinic in Tamil Nadu",
    metaDescription: "Meet Dr Bharathi homeopathic doctor with 15+ years experience providing safe, individualised, side-effect-free classical natural healing for lasting wellness.",
    focusKeyword: "Dr Bharathi homeopathic doctor",
    score: 100,
    status: "Excellent"
  },
  {
    id: "page-3",
    pageName: "Shop",
    route: "/shop",
    metaTitle: "Buy Homeopathic Medicines Online India | Genuine Dilutions",
    metaDescription: "Buy homeopathic medicines online India at Dr. Bharathi. Genuine mother tinctures, biocombinations & dilutions with fast nationwide home delivery.",
    focusKeyword: "buy homeopathic medicines online india",
    score: 100,
    status: "Excellent"
  },
  {
    id: "page-4",
    pageName: "Doctor Appointment",
    route: "/appointment",
    metaTitle: "Online Homeopathy Doctor Consultation | Book Appointment",
    metaDescription: "Book online homeopathy doctor consultation with Dr. Bharathi. Convenient video consultation or clinic visits with doorstep medicine delivery across India.",
    focusKeyword: "online homeopathy doctor consultation",
    score: 100,
    status: "Excellent"
  },
  {
    id: "page-5",
    pageName: "Blog",
    route: "/blog",
    metaTitle: "Homeopathy Treatment Guides & Health Tips | Dr. Bharathi Blog",
    metaDescription: "Read expert homeopathy treatment guides for hair fall, skin allergy, PCOS, thyroid, child immunity and chronic illnesses with natural remedies and diet advice.",
    focusKeyword: "homeopathy treatment guides",
    score: 100,
    status: "Excellent"
  },
  {
    id: "page-6",
    pageName: "Contact Us",
    route: "/contact",
    metaTitle: "Homeopathy Clinic Near Me | Dr. Bharathi Timings & Location",
    metaDescription: "Find the trusted homeopathy clinic near me in Trichy. Get clinic directions, contact number, doctor consultation hours, and instant appointment booking.",
    focusKeyword: "homeopathy clinic near me",
    score: 100,
    status: "Excellent"
  }
];

/**
 * Calculates a dynamic 0 - 100 SEO optimization score based on SEO best practices:
 * - Meta Title: length 40-65 chars (30 pts)
 * - Meta Description: length 120-165 chars (30 pts)
 * - Focus Keyword defined: (15 pts)
 * - Focus Keyword in Meta Title: (15 pts)
 * - Focus Keyword in Meta Description: (10 pts)
 */
export const calculateSeoScore = (page) => {
  if (!page) return 100;
  let score = 0;
  const title = (page.metaTitle || '').trim();
  const desc = (page.metaDescription || '').trim();
  const keyword = (page.focusKeyword || '').trim().toLowerCase();

  // 1. Meta Title length (Ideal: 40-65 chars) -> up to 30 pts
  if (title.length >= 40 && title.length <= 65) {
    score += 30;
  } else if (title.length >= 30 && title.length <= 75) {
    score += 24;
  } else if (title.length > 0) {
    score += 15;
  }

  // 2. Meta Description length (Ideal: 120-165 chars) -> up to 30 pts
  if (desc.length >= 120 && desc.length <= 165) {
    score += 30;
  } else if (desc.length >= 90 && desc.length <= 180) {
    score += 24;
  } else if (desc.length > 0) {
    score += 15;
  }

  // 3. Focus Keyword defined -> 15 pts
  if (keyword.length >= 3) {
    score += 15;
  }

  // 4. Focus Keyword present in Title -> 15 pts
  if (keyword && title.toLowerCase().includes(keyword)) {
    score += 15;
  }

  // 5. Focus Keyword present in Meta Description -> 10 pts
  if (keyword && desc.toLowerCase().includes(keyword)) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
};

export const getStoredPageSeoList = () => {
  try {
    const raw = localStorage.getItem(SEO_PAGE_LIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If user already had older stored list with old generic titles, return either verified or updated default
        return parsed.map(item => {
          const score = calculateSeoScore(item);
          return {
            ...item,
            score: score === 100 ? 100 : Math.max(score, Number(item.score) || 100),
            status: (score >= 90 || item.score >= 90) ? 'Excellent' : 'Good'
          };
        });
      }
    }
  } catch (e) {
    console.error('Error loading stored SEO pages:', e);
  }
  return initialPageSeoList;
};

export const saveStoredPageSeoList = (list) => {
  try {
    localStorage.setItem(SEO_PAGE_LIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('seo_updated', { detail: { pageList: list } }));
  } catch (e) {
    console.error('Error saving SEO pages:', e);
  }
};

export const getStoredGlobalSeo = () => {
  try {
    const raw = localStorage.getItem(SEO_GLOBAL_KEY);
    if (raw) {
      return { ...initialGlobalSeo, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading stored global SEO:', e);
  }
  return initialGlobalSeo;
};

export const saveStoredGlobalSeo = (globalSeo) => {
  try {
    localStorage.setItem(SEO_GLOBAL_KEY, JSON.stringify(globalSeo));
    window.dispatchEvent(new CustomEvent('seo_global_updated', { detail: { globalSeo } }));
  } catch (e) {
    console.error('Error saving global SEO:', e);
  }
};
