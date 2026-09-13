import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';

dotenv.config();

export const seedInitialData = async () => {
  try {
    const adminEmail = 'admin@drbharathi.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      admin = await User.create({
        name: 'Clinic Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '+91 98765 43210'
      });
      console.log(`[Seed] Created default admin user: ${adminEmail}`);
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
      console.log(`[Seed] Updated ${adminEmail} to admin role`);
    }

    // Default Categories
    const defaultCategories = [
      { name: 'Homeopathic Medicines', slug: 'homeopathic-medicines', description: 'Classical homeopathic dilutions, pellets, and bio-combination remedies' },
      { name: 'Mother Tinctures', slug: 'mother-tinctures', description: 'Pure concentrated botanical extract mother tinctures' },
      { name: 'Biochemic Medicines', slug: 'biochemic-medicines', description: 'Schuessler tissue cell salts and bio-combinations' },
      { name: 'Wellness Products', slug: 'wellness-products', description: 'General immunity boosters, health tonics, and preventive drops' },
      { name: 'Personal Care', slug: 'personal-care', description: 'Natural hair oils, creams, soaps, and skin remedies' },
      { name: 'Combo Products', slug: 'combo-products', description: 'Curated wellness remedy value packs and family wellness kits' }
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }
    console.log('[Seed] Database initial seeding verified successfully');
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
