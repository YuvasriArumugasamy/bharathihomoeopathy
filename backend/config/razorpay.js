import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const configDirectory = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(configDirectory, '../.env') });

// Read credentials when a payment request arrives so dotenv and deployment
// environment variables are both available before the SDK is initialized.
export const getRazorpayKeyId = () =>
  process.env.RAZORPAY_KEY_ID?.trim() || process.env.LIVE_API_KEY?.trim() || '';

export const getRazorpayKeySecret = () =>
  process.env.RAZORPAY_KEY_SECRET?.trim() || process.env.LIVE_KEY_SECRET?.trim() || '';

export const getRazorpayInstance = () => {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  if (!keyId || !keySecret) return null;

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};
