import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const seedInitialData = async () => {
  try {
    const adminEmail = 'admin@drbharathi.com';
    const adminSeedPassword = process.env.ADMIN_SEED_PASSWORD?.trim();
    // Password is select:false in the schema; select it only for an explicitly
    // configured secret-based password reset.
    let admin = await User.findOne({ email: adminEmail }).select('+password');

    if (!admin) {
      if (adminSeedPassword) {
        // Let the User model's pre('save') hook handle password hashing.
        admin = await User.create({
          name: 'Clinic Administrator',
          email: adminEmail,
          password: adminSeedPassword,
          role: 'admin',
          phone: '+91 90258 54711'
        });
        console.log(`[Seed] Created administrator account: ${adminEmail}`);
      } else {
        console.warn('[Seed] ADMIN_SEED_PASSWORD is unset; skipped admin account creation.');
      }
    } else {
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log(`[Seed] Updated ${adminEmail} to admin role`);
      }
      if (adminSeedPassword && !(await admin.matchPassword(adminSeedPassword))) {
        admin.password = adminSeedPassword;
        admin.role = 'admin';
        await admin.save();
        console.log('[Seed] Admin password reset from ADMIN_SEED_PASSWORD.');
      }
    }

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
