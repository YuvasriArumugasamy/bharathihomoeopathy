import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let admin = null;
let initialized = false;

export const initFirebase = async () => {
  if (initialized) return admin;

  // Check if serviceAccountKey.json exists locally
  const localKeyPath = path.join(__dirname, 'serviceAccountKey.json');
  let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccount && fs.existsSync(localKeyPath)) {
    try {
      serviceAccount = fs.readFileSync(localKeyPath, 'utf8');
    } catch (e) {
      console.warn('Could not read local serviceAccountKey.json:', e.message);
    }
  }

  if (!serviceAccount) {
    console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_JSON / serviceAccountKey.json not set — server push notifications via FCM disabled.');
    return null;
  }

  try {
    const adminModule = await import('firebase-admin');
    admin = adminModule.default || adminModule;

    const serviceAccountObj = typeof serviceAccount === 'string' ? JSON.parse(serviceAccount) : serviceAccount;
    if (serviceAccountObj.private_key) {
      let key = serviceAccountObj.private_key;
      // Convert double escaped newlines to real newlines (common in Render / Vercel environment variables)
      key = key.replace(/\\n/g, '\n');
      
      // If it doesn't have standard newlines, rebuild it in PEM format
      if (!key.includes('\n') || key.split('\n').length < 3) {
        const body = key
          .replace('-----BEGIN PRIVATE KEY-----', '')
          .replace('-----END PRIVATE KEY-----', '')
          .replace(/\s+/g, '')
          .trim();
        const chunks = body.match(/.{1,64}/g);
        if (chunks) {
          key = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`;
        }
      }
      
      serviceAccountObj.private_key = key;
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountObj),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'bharathi-homoeopathy-clinic.firebasestorage.app',
    });
    initialized = true;
    console.log('✅ Firebase Admin SDK initialized for push notifications');
  } catch (err) {
    console.error('❌ Firebase Admin init failed:', err.message);
    return null;
  }

  return admin;
};

export { admin };
