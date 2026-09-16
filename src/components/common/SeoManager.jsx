import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getStoredPageSeoList, getStoredGlobalSeo, initialGlobalSeo } from '../../data/adminSeoData';

/**
 * SeoManager dynamically updates page titles, meta descriptions,
 * OpenGraph, Twitter card tags, canonical link, and JSON-LD structured
 * data on route navigation, ensuring 100% SEO compliance on every page.
 */
export const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const updateHeadTags = () => {
      const pageList = getStoredPageSeoList();
      const globalSeo = getStoredGlobalSeo() || initialGlobalSeo;

      // Find matching route or fallback to defaults
      let currentPath = location.pathname;
      if (currentPath.length > 1 && currentPath.endsWith('/')) {
        currentPath = currentPath.slice(0, -1);
      }

      let matchedPage = pageList.find(p => p.route === currentPath);

      // Handle product detail or special dynamic paths
      if (!matchedPage && currentPath.startsWith('/product/')) {
        matchedPage = {
          metaTitle: "Product Details & Remedies | Dr. Bharathi’s Homeo Care",
          metaDescription: "Verified homeopathic dilutions, mother tinctures, and wellness remedies with authentic formulations and doctor guidance.",
          focusKeyword: "homeopathic remedies"
        };
      } else if (!matchedPage && currentPath === '/best-sellers') {
        matchedPage = {
          metaTitle: "Best Selling Homeopathic Medicines | Dr. Bharathi’s Homeo Care",
          metaDescription: "Explore our most trusted and top-rated homeopathic medicines, dilutions, and wellness products with doorstep delivery.",
          focusKeyword: "best homeopathic medicines"
        };
      } else if (!matchedPage && currentPath === '/offers') {
        matchedPage = {
          metaTitle: "Special Health Offers & Deals | Dr. Bharathi’s Homeo Care",
          metaDescription: "Get genuine homeopathic medicines and natural wellness packs with exclusive discounts and free clinic consultation offers.",
          focusKeyword: "homeopathy medicine offers"
        };
      } else if (!matchedPage) {
        // Fallback for admin or unindexed utility routes
        if (currentPath.startsWith('/admin')) {
          document.title = "Admin Portal | Dr. Bharathi’s Homeo Care";
          return;
        }
        matchedPage = {
          metaTitle: globalSeo.metaTitle,
          metaDescription: globalSeo.metaDescription,
          focusKeyword: globalSeo.keywords
        };
      }

      // 1. Update Document Title
      document.title = matchedPage.metaTitle || globalSeo.metaTitle;

      // 2. Helper to set or create meta tag
      const setMeta = (name, content, isProperty = false) => {
        if (!content) return;
        const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let meta = document.querySelector(selector);
        if (!meta) {
          meta = document.createElement('meta');
          if (isProperty) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // 3. Update Standard Meta Tags
      setMeta('description', matchedPage.metaDescription || globalSeo.metaDescription);
      setMeta('keywords', matchedPage.focusKeyword ? `${matchedPage.focusKeyword}, ${globalSeo.keywords}` : globalSeo.keywords);
      setMeta('robots', globalSeo.robotsIndex !== false ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' : 'noindex, nofollow');

      // 4. Update OpenGraph Tags
      const currentUrl = window.location.origin + location.pathname;
      setMeta('og:title', matchedPage.metaTitle || globalSeo.metaTitle, true);
      setMeta('og:description', matchedPage.metaDescription || globalSeo.metaDescription, true);
      setMeta('og:url', currentUrl, true);
      setMeta('og:type', 'website', true);
      setMeta('og:site_name', "Dr. Bharathi’s Homeo Care", true);
      if (globalSeo.socialShare?.ogImage) {
        setMeta('og:image', globalSeo.socialShare.ogImage, true);
      }

      // 5. Update Twitter Card Tags
      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:title', matchedPage.metaTitle || globalSeo.metaTitle);
      setMeta('twitter:description', matchedPage.metaDescription || globalSeo.metaDescription);
      if (globalSeo.socialShare?.ogImage) {
        setMeta('twitter:image', globalSeo.socialShare.ogImage);
      }

      // 6. Canonical Link
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', currentUrl);

      // 7. Inject / Update Schema.org Structured Data
      let schemaScript = document.getElementById('dr-bharathi-seo-schema');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dr-bharathi-seo-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }

      const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["MedicalBusiness", "Physician", "LocalBusiness"],
            "@id": `${window.location.origin}/#clinic`,
            "name": "Dr. Bharathi’s Homeo Care",
            "url": window.location.origin,
            "logo": `${window.location.origin}/logo.png`,
            "image": globalSeo.socialShare?.ogImage || `${window.location.origin}/logo.png`,
            "telephone": "+91 94431 82828",
            "priceRange": "₹₹",
            "medicalSpecialty": "Homeopathy",
            "description": globalSeo.metaDescription,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Main Road, Thillai Nagar",
              "addressLocality": "Tiruchirappalli",
              "addressRegion": "Tamil Nadu",
              "postalCode": "620018",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 10.7905,
              "longitude": 78.7047
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "21:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Sunday"],
                "opens": "10:00",
                "closes": "14:00"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "bestRating": "5",
              "ratingCount": "1250"
            }
          },
          {
            "@type": "WebPage",
            "@id": currentUrl,
            "url": currentUrl,
            "name": matchedPage.metaTitle || globalSeo.metaTitle,
            "description": matchedPage.metaDescription || globalSeo.metaDescription,
            "isPartOf": {
              "@type": "WebSite",
              "@id": `${window.location.origin}/#website`,
              "name": "Dr. Bharathi’s Homeo Care",
              "url": window.location.origin
            }
          }
        ]
      };

      schemaScript.textContent = JSON.stringify(schemaData);
    };

    updateHeadTags();

    // Listen for custom SEO updates from admin panel in real-time
    const handleUpdate = () => updateHeadTags();
    window.addEventListener('seo_updated', handleUpdate);
    window.addEventListener('seo_global_updated', handleUpdate);

    return () => {
      window.removeEventListener('seo_updated', handleUpdate);
      window.removeEventListener('seo_global_updated', handleUpdate);
    };
  }, [location.pathname]);

  return null;
};
