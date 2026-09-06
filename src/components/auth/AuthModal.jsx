import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { assets } from '../../assets';

export const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, setAuthModalTab, closeAuthModal, login, register, googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form States
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  // Google Sign In Handler
  const handleGoogleSignIn = () => {
    showToast('Connecting to Google...', 'info');
    setTimeout(() => {
      login('patient.google@example.com', 'google-auth');
      showToast('Signed in with Google successfully!', 'success');
      closeAuthModal();
    }, 400);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Reset form inputs & prevent background scroll when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      setLoginEmail('');
      setLoginPassword('');
      setRegisterData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: true,
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen, authModalTab]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      showToast('Please enter your email and password', 'warning');
      return;
    }
    setLoginLoading(true);
    const res = await login(loginEmail.trim(), loginPassword);
    setLoginLoading(false);

    if (res.success) {
      showToast('Welcome back to Dr. Bharathi’s Homeo Care!', 'success');
      closeAuthModal();
    } else {
      showToast(res.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerData.email.trim() || !registerData.password) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }
    if (registerData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }
    if (!registerData.agreeTerms) {
      showToast('Please accept the terms and conditions to proceed', 'warning');
      return;
    }

    setRegisterLoading(true);
    const res = await register({
      firstName: 'User',
      lastName: '',
      email: registerData.email.trim(),
      phone: '',
      password: registerData.password,
    });
    setRegisterLoading(false);

    if (res.success) {
      showToast('Account created successfully! Welcome to Dr. Bharathi’s Homeo Care', 'success');
      closeAuthModal();
    } else {
      showToast(res.message || 'Registration failed. Please try again.', 'error');
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-scrollbar">
      
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={closeAuthModal}
        className="fixed inset-0 bg-[#0b1727]/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Split Box with responsive background image (loginBg for mobile, logoBg3 for desktop) */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row bg-cover bg-no-repeat bg-top md:bg-left-top animate-in zoom-in-95 fade-in duration-200"
        style={{ backgroundImage: `url(${isMobile ? (assets.loginBg || assets.logoBg3) : assets.logoBg3})` }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Column Spacer (Desktop) so Doctor illustration shows */}
        <div className="hidden md:block md:w-5/12 min-h-[480px] pointer-events-none" />

        {/* Right Column: Form Panel */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 pt-16 sm:pt-8 relative flex flex-col justify-between overflow-y-auto no-scrollbar max-h-[90vh] bg-white/90 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none">
          
          {/* Close 'X' Button on Top Right */}
          <button
            onClick={closeAuthModal}
            className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-4">
            
            {/* Header Text */}
            <div className="space-y-1 pr-8">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {authModalTab === 'login' ? 'Log in to your account' : 'Create your account'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {authModalTab === 'login' 
                  ? 'Welcome back! Enter your details below' 
                  : 'Join thousands of patients healing naturally'}
              </p>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Log in with Google</span>
            </button>

            {/* Switch Mode Prompt Link */}
            <div className="text-center text-xs sm:text-sm text-slate-600 font-medium">
              {authModalTab === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('register')}
                    className="text-slate-900 font-extrabold hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('login')}
                    className="text-slate-900 font-extrabold hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </span>
              )}
            </div>

            {/* Divider Line */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider absolute">
                {authModalTab === 'login' ? 'Or continue with' : 'OR CONTINUE WITH'}
              </span>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {authModalTab === 'login' && (
              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-3.5 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Email / Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter Your Email or Phone Number"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#183b43] focus:ring-1 focus:ring-[#183b43] transition-colors text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter Your Password"
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#183b43] focus:ring-1 focus:ring-[#183b43] transition-colors text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Right Link */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => showToast('Password reset instructions sent to your email/phone.', 'info')}
                    className="text-xs sm:text-sm font-bold text-red-500 hover:text-red-600 hover:underline transition-colors cursor-pointer"
                  >
                    Forget Password?
                  </button>
                </div>

                {/* Dark Brand Log In Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 px-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-[#183b43] hover:bg-[#10292f] rounded-xl shadow-md transition-all active:scale-98 cursor-pointer mt-1"
                >
                  {loginLoading ? 'Signing In...' : 'Log In'}
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {authModalTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Email / Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="Enter Your Email or Phone Number"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#183b43] focus:ring-1 focus:ring-[#183b43]"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Enter Your Password"
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#183b43] focus:ring-1 focus:ring-[#183b43]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                    >
                      {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={registerData.agreeTerms}
                      onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-[#183b43] accent-[#183b43] focus:ring-[#183b43] cursor-pointer"
                    />
                    <span>I agree to Dr. Bharathi's Terms & Privacy Policy</span>
                  </label>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full py-3.5 px-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-[#183b43] hover:bg-[#10292f] rounded-xl shadow-md transition-all active:scale-98 cursor-pointer mt-1"
                >
                  {registerLoading ? 'Creating Account...' : 'SIGN UP'}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
