// Legacy categories previously inserted automatically by backend startup seeding.
// Matching both slug and description leaves admin-created categories untouched.
export const legacySeedCategories = [
  { slug: 'homeopathic-medicines', description: 'Classical homeopathic dilutions, pellets, and bio-combination remedies' },
  { slug: 'mother-tinctures', description: 'Pure concentrated botanical extract mother tinctures' },
  { slug: 'biochemic-medicines', description: 'Schuessler tissue cell salts and bio-combinations' },
  { slug: 'wellness-products', description: 'General immunity boosters, health tonics, and preventive drops' },
  { slug: 'personal-care', description: 'Natural hair oils, creams, soaps, and skin remedies' },
  { slug: 'combo-products', description: 'Curated wellness remedy value packs and family wellness kits' }
];

export const isLegacySeedCategory = (category) =>
  category?.isSeedDefault === true
  || (String(category?.name || '').trim().toLowerCase() === 'medical--'
    && String(category?.slug || '').trim().toLowerCase() === 'medical')
  || legacySeedCategories.some((seed) =>
    String(category?.slug || '').trim().toLowerCase() === seed.slug
    && String(category?.description || '').trim() === seed.description
  );

export const filterLegacySeedCategories = (categories) =>
  Array.isArray(categories) ? categories.filter((category) => !isLegacySeedCategory(category)) : [];
