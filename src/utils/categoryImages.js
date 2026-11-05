import { assets } from '../assets';

/**
 * Universal category display image resolver.
 * Ensures Admin Categories and User Store/Home pages display the EXACT same authentic images.
 */
export const getCategoryDisplayImage = (cat, idx = 0) => {
  if (!cat) return assets.p1;
  const img = cat.image || cat.imageUrl;

  // If a valid custom image was uploaded by Admin (base64, local asset, or external URL)
  if (img && typeof img === 'string') {
    // Strip the unwanted legacy yoga silhouette unsplash photo
    if (!img.includes('1544367567-0f2fcb009e0b') && !img.includes('1608248597359')) {
      if (img.startsWith('data:') || img.startsWith('http') || img.startsWith('/') || img.startsWith('blob:')) {
        return img;
      }
    }
  }

  // Authentic Homeopathic Remedy Category Mappings
  const name = String(cat.name || '').trim().toLowerCase();
  if (name.includes('homeo')) return assets.p1;
  if (name.includes('tincture')) return assets.p2;
  if (name.includes('biochemic')) return assets.p3;
  if (name.includes('wellness') || name.includes('herbal')) return assets.p4;
  if (name.includes('personal')) return assets.p5;
  if (name.includes('combo')) return assets.p6;
  if (name.includes('condition')) return assets.p7;

  const fallbackList = [assets.p1, assets.p2, assets.p3, assets.p4, assets.p5, assets.p6, assets.p7];
  return fallbackList[idx % fallbackList.length] || assets.p1;
};

