import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

export const seedInitialData = async () => {
  try {
    const adminEmail = 'admin@drbharathi.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      // Let the User model's pre('save') hook handle password hashing
      admin = await User.create({
        name: 'Clinic Administrator',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        phone: '+91 90258 54711'
      });
      console.log(`[Seed] Created default admin user: ${adminEmail}`);
    } else {
      // Fix existing admin: if password is double-hashed or role is wrong, recreate
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log(`[Seed] Updated ${adminEmail} to admin role`);
      }
      // Verify password works; if not, reset it
      const isMatch = await admin.matchPassword('admin123');
      if (!isMatch) {
        // Password is corrupted (double-hashed) - reset it via direct field update
        // We must use save() so the pre-save hook re-hashes correctly
        admin.password = 'admin123';
        admin.role = 'admin';
        await admin.save();
        console.log(`[Seed] Reset admin password (was double-hashed)`);
      }
    }

    // Remove categories that older releases inserted automatically. Keep an
    // inactive marker when products still reference one, so those products are
    // preserved and an admin can explicitly recreate the category later.
    const legacySeedCategories = [
      { name: 'Homeopathic Medicines', slug: 'homeopathic-medicines', description: 'Classical homeopathic dilutions, pellets, and bio-combination remedies' },
      { name: 'Mother Tinctures', slug: 'mother-tinctures', description: 'Pure concentrated botanical extract mother tinctures' },
      { name: 'Biochemic Medicines', slug: 'biochemic-medicines', description: 'Schuessler tissue cell salts and bio-combinations' },
      { name: 'Wellness Products', slug: 'wellness-products', description: 'General immunity boosters, health tonics, and preventive drops' },
      { name: 'Personal Care', slug: 'personal-care', description: 'Natural hair oils, creams, soaps, and skin remedies' },
      { name: 'Combo Products', slug: 'combo-products', description: 'Curated wellness remedy value packs and family wellness kits' }
    ];

    for (const cat of legacySeedCategories) {
      const seededCategory = await Category.findOne({ slug: cat.slug, description: cat.description });
      if (!seededCategory) continue;

      const productCount = await Product.countDocuments({ category: seededCategory._id });
      if (productCount > 0) {
        seededCategory.isActive = false;
        seededCategory.isSeedDefault = true;
        await seededCategory.save();
      } else {
        await Category.deleteOne({ _id: seededCategory._id });
      }
    }
    console.log('[Seed] Default category seeds removed; admin-created categories preserved.');
  } catch (err) {
    console.warn('[Seed Warning] Could not complete database seeding:', err.message);
  }
};

// If run directly via node CLI
if (process.argv[1]?.endsWith('seedAdmin.js')) {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dr_bharathi_homeo_care';
  mongoose.connect(uri)
    .then(async () => {
      console.log('[Seed CLI] Connected to MongoDB');
      await seedInitialData();
      await mongoose.disconnect();
      console.log('[Seed CLI] Completed and disconnected.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed CLI Error]', err.message);
      process.exit(1);
    });
}
