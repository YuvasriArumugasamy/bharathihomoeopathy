const testLabel = /^(?:test|demo|sample|dummy)(?:\b|[-_\s])/i;

export const isLegacyTestProduct = (product = {}) => {
  const isJunkLabel = (value) => {
    const label = String(value || '').trim();
    return /^mn$/i.test(label) || /^kjds$/i.test(label) || testLabel.test(label);
  };
  const category = product.category;
  return isJunkLabel(product.name) || isJunkLabel(product.slug) ||
    isJunkLabel(typeof category === 'string' ? category : category?.name) ||
    isJunkLabel(category?.slug);
};
