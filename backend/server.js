// Backend server.js - backend entry point
// Ensures all routes including appointmentRoutes are mounted correctly for Render deployment.
// Last updated: 2026-09-16 - force Render re-deploy to pick up appointmentRoutes
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
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

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
