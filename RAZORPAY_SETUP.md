# Razorpay Payment Gateway Setup Guide

## Overview
Dr. Bharathi’s Homeo Care uses official Razorpay Checkout for accepting payments via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking.

## How to Configure Your Razorpay Key

You have two easy ways to add your Razorpay Key ID:

### Option 1: Via Admin Panel (Easiest & Instant)
1. Go to the Admin Dashboard (`/admin/settings`).
2. Click on **Payment Gateways** tab.
3. Enter your **Razorpay Key ID** (e.g., `rzp_live_...` for live payments or `rzp_test_...` for testing).
4. Click **Save Changes**.
5. Razorpay is now live on your checkout immediately!

### Option 2: Via Environment Variables (.env / Vercel)
1. In your local `.env` file or on your **Vercel Project Settings > Environment Variables**:
   ```env
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   ```
2. Redeploy or restart the app.

### Optional: Backend Secret (for Server Verification)
If you wish to enable server-side signature verification on your Render backend:
1. In Render dashboard for your backend service, add:
   - `RAZORPAY_KEY_ID=your_razorpay_key_id`
   - `RAZORPAY_KEY_SECRET=your_razorpay_key_secret`
