import mongoose from 'mongoose';
import { seedInitialData } from '../utils/seedAdmin.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dr_bharathi_homeo_care');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    await seedInitialData();
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    // Keep process alive for local demo mode resilience
  }
};
