# 🔐 Google Login Setup Guide (தமிழ் விளக்கம்)

இந்த guide-ல Google Login-ஐ உங்க application-ல எப்படி setup செய்யணும்னு step-by-step சொல்லியிருக்கேன்.

---

## 📋 Prerequisites (முன்நிபந்தனைகள்)

1. Google Account (Gmail account)
2. Node.js & npm installed
3. MongoDB running (local or cloud)

---

## 🚀 Step 1: Google Cloud Console Setup

### 1.1 Google Cloud Project Create பண்ணுங்க

1. போங்க: https://console.cloud.google.com/
2. **"Select a project"** click பண்ணி → **"New Project"** select பண்ணுங்க
3. Project name கொடுங்க (example: "Dr Bharathi Homeo Care")
4. **"Create"** click பண்ணுங்க

### 1.2 OAuth Consent Screen Setup

1. Left sidebar-ல **"APIs & Services"** → **"OAuth consent screen"** select பண்ணுங்க
2. **"External"** select பண்ணி → **"Create"** click பண்ணுங்க
3. Fill பண்ணுங்க:
   - **App name**: Dr. Bharathi's Homeo Care
   - **User support email**: உங்க email
   - **Developer contact**: உங்க email
4. **"Save and Continue"** click பண்ணுங்க
5. Scopes page-ல → **"Save and Continue"** (nothing to add)
6. Test users page-ல → உங்க test email add பண்ணுங்க → **"Save and Continue"**

### 1.3 OAuth Client ID Create பண்ணுங்க

1. Left sidebar-ல **"Credentials"** click பண்ணுங்க
2. Top-ல **"+ Create Credentials"** → **"OAuth client ID"** select பண்ணுங்க
3. **Application type**: "Web application" select பண்ணுங்க
4. **Name**: "Dr Bharathi Web Client"
5. **Authorized JavaScript origins** add பண்ணுங்க:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
6. **Authorized redirect URIs** add பண்ணுங்க:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
7. **"Create"** click பண்ணுங்க
8. **Client ID** copy பண்ணி safe-ஆ வச்சுக்கோங்க! 📋

---

## 🔧 Step 2: Backend Setup

### 2.1 Install Dependencies (Backend)

```bash
cd backend
npm install
```

### 2.2 Environment Variables Setup

1. `backend/.env` file create பண்ணுங்க (இல்ல already இருந்தா open பண்ணுங்க)
2. இந்த line-ஐ add பண்ணுங்க:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=paste_your_google_client_id_here
```

**உங்க Client ID-ஐ paste பண்ணுங்க!**

### 2.3 Start Backend Server

```bash
cd backend
npm run dev
```

Backend இப்போ run ஆகும்: **http://localhost:5000**

---

## 🎨 Step 3: Frontend Setup

### 3.1 Install Dependencies (Frontend)

```bash
# Root directory-ல (frontend folder)
npm install
```

### 3.2 Environment Variables Setup

1. Root directory-ல `.env` file create பண்ணுங்க
2. இந்த line-ஐ add பண்ணுங்க:

```env
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=paste_your_google_client_id_here

# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

**Same Client ID-ஐ இங்கும் paste பண்ணுங்க!**

### 3.3 Start Frontend Server

```bash
npm run dev
```

Frontend இப்போ run ஆகும்: **http://localhost:5173**

---

## 🧪 Step 4: Testing Google Login

### 4.1 Login Modal-ஐ Use பண்ணுங்க

உங்க application-ல Login Modal-ஐ open பண்ணுங்க. Example:

```jsx
import { useState } from 'react';
import LoginModal from './components/LoginModal';
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const { googleLogin } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential);
    
    if (result.success) {
      alert('Login successful! Welcome ' + result.user.name);
      setShowModal(false);
    } else {
      alert('Login failed: ' + result.message);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Login
      </button>
      
      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGoogleSuccess={handleGoogleSuccess}
      />
    </>
  );
}
```

### 4.2 Test பண்ணுங்க

1. **"Log in with Google"** button click பண்ணுங்க
2. உங்க Google account select பண்ணுங்க
3. Permission allow பண்ணுங்க
4. Success! User logged in! 🎉

---

## 📝 API Endpoints

Backend-ல இந்த endpoints ready:

### 1. Regular Login
```
POST /api/auth/login
Body: { email, password }
```

### 2. Register
```
POST /api/auth/register
Body: { name, email, password, phone }
```

### 3. **Google Login** (புதுசா!)
```
POST /api/auth/google-login
Body: { credential: "google_token_here" }
```

### 4. Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer your_jwt_token" }
```

---

## 🎨 UI Components Created

### 1. `LoginModal.jsx`
- அந்த image மாதிரி beautiful modal
- Split design (left promotional, right form)
- Google login button integrated
- Email/password login
- Responsive design

### 2. `GoogleLoginButton.jsx`
- Google OAuth button component
- Customizable styling
- Error handling

### 3. `LoginModalExample.jsx`
- Usage example component
- Complete integration demo

---

## 🔐 Security Notes

✅ **இதெல்லாம் already implemented:**

1. JWT token authentication
2. Password hashing (bcrypt)
3. Google token verification (backend)
4. Protected routes
5. User session management

---

## 🐛 Common Issues & Solutions

### Issue 1: "Invalid Client ID"
**Solution:** `.env` file-ல correct Client ID இருக்கா check பண்ணுங்க

### Issue 2: "Redirect URI mismatch"
**Solution:** Google Console-ல உங்க localhost URL add பண்ணீங்களா check பண்ணுங்க

### Issue 3: Google button காட்டல
**Solution:** 
- Browser console-ல errors இருக்கா பாருங்க
- `VITE_GOOGLE_CLIENT_ID` environment variable set ஆச்சா confirm பண்ணுங்க
- Server restart பண்ணுங்க

### Issue 4: Backend connection error
**Solution:**
- Backend server run ஆகுதா check பண்ணுங்க (port 5000)
- MongoDB connection working-ஆ இருக்கா பாருங்க

---

## 📦 Installed Packages

### Backend:
- `google-auth-library` - Google token verification

### Frontend:
- `@react-oauth/google` - Google OAuth integration

---

## 🎯 Next Steps

இப்போ உங்களால்:

1. ✅ Google login use பண்ண முடியும்
2. ✅ Regular email/password login use பண்ண முடியும்
3. ✅ User details store ஆகும் (MongoDB)
4. ✅ JWT tokens generate ஆகும்
5. ✅ Protected routes access பண்ண முடியும்

---

## 💡 Tips

- Production-ல போடும்போது production domain-ஐ Google Console-ல add பண்ணுங்க
- Test users-ஐ remove பண்ணி publish to production mode-ல மாத்துங்க
- Environment variables-ஐ secure-ஆ store பண்ணுங்க (never commit `.env` files!)

---

## 🤝 Support

ஏதாவது doubt இருந்தா கேளுங்க! நான் help பண்றேன் 😊

Happy Coding! 🚀
