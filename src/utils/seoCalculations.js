export const calculateSeoScore = (item) => {
  let score = 0;
  if (!item) return 0;

  // Title check (30-60 chars)
  if (item.metaTitle || item.seoTitle) {
    const title = (item.metaTitle || item.seoTitle).trim();
    if (title.length >= 30 && title.length <= 60) score += 30;
    else if (title.length > 0) score += 15;
  }

  // Description check (70-160 chars)
  if (item.metaDescription || item.seoDescription) {
    const desc = (item.metaDescription || item.seoDescription).trim();
    if (desc.length >= 70 && desc.length <= 160) score += 35;
    else if (desc.length > 0) score += 15;
  }

  // Focus keyword check
  if (item.focusKeyword || (item.seoKeywords && item.seoKeywords.length > 0)) {
    score += 20;
  }

  // Slug check
  if (item.slug || item.route) {
    score += 15;
  }

  return Math.min(100, Math.max(0, score));
};

export const getSeoHealthLabel = (score) => {
  if (score >= 80) return { label: 'Good', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (score >= 50) return { label: 'Needs Improvement', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  return { label: 'Poor', color: 'text-rose-600 bg-rose-50 border-rose-200' };
};
