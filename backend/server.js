// Backend server.js - backend entry point
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initFirebase } from './config/firebase.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { notFound } from './middleware/notFoundMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import { cleanupTestCatalog, resetTestData } from './controllers/adminController.js';
import { protect } from './middleware/authMiddleware.js';
import { adminOnly } from './middleware/adminMiddleware.js';

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Firebase Admin for Push Notifications
initFirebase();

const app = express();

// Middlewares
// CLIENT_URL accepts a comma-separated list for local and deployed frontends.
// Normalize configured URLs so a trailing slash cannot accidentally block CORS.
const normalizeOrigin = (value) => {
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
};

const allowedOrigins = new Set([
  ...(process.env.CLIENT_URL || '').split(',').map(normalizeOrigin).filter(Boolean),
  'http://localhost:5173',
  'https://bharathihomoeopathy.vercel.app',
  'https://bharathihomeopathy.vercel.app',
  'https://bharathihomoeopathy.com',
  'https://www.bharathihomoeopathy.com',
  'http://bharathihomoeopathy.com',
  'http://www.bharathihomoeopathy.com'
].map(normalizeOrigin).filter(Boolean));

const corsOptions = {
  origin: (origin, callback) => {
    // Requests without Origin are server-to-server or same-origin requests.
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) return callback(null, true);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true
};

// Explicitly answer browser preflight requests before they reach API routes.
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Render hosts the backend API; the frontend is deployed separately on Vercel.
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Dr. Bharathi's Homeo Care backend API is running.",
    health: '/api/health'
  });
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Dr. Bharathi's Homeo Care API is running healthy",
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/visitors', visitorRoutes);
app.post('/api/admin/reset-test-data', protect, adminOnly, resetTestData);
app.post('/api/admin/cleanup-test-catalog', protect, adminOnly, cleanupTestCatalog);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Dr. Bharathi's Homeo Care Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
