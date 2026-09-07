import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import assets from '../../assets';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const redirectUrl = searchParams.get('redirect') || '/admin';

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanUsername = username.trim().toLowerCase();

    // 1. Empty field validation
    if (!cleanUsername && !password) {
      setFormError('Username and Password are required.');
      showToast('Please enter both Username and Password.', 'warning');
      return;
    }

    if (!cleanUsername) {
      setFormError('Username is required.');
      showToast('Please enter your Admin Username.', 'warning');
      return;
    }

    if (!password) {
      setFormError('Password is required.');
      showToast('Please enter your Admin Password.', 'warning');
      return;
    }

    // 2. Strict Username validation
    if (cleanUsername !== 'admin@drbharathi.com' && cleanUsername !== 'admin') {
      setFormError('Invalid Admin Username. Access Denied.');
      showToast('Invalid Admin Username. Please enter valid admin credentials.', 'error');
      return;
    }

    // 3. Strict Password validation
    if (password !== 'admin123') {
      setFormError('Incorrect Admin Password. Access Denied.');
      showToast('Incorrect Admin Password. Access Denied.', 'error');
      return;
    }

    // 4. Submit to Auth Provider
    setLoading(true);
    try {
      const res = await login(cleanUsername, password);
      setLoading(false);

      if (res.success && (res.user?.role === 'admin' || cleanUsername.includes('admin'))) {
        showToast('Welcome to Admin Portal!', 'success');
        navigate(redirectUrl, { replace: true });
      } else {
        const errorMsg = res.message || 'Invalid Admin Credentials.';
        setFormError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = 'Login failed. Please try again.';
      setFormError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden bg-cover bg-center font-sans"
      style={{ backgroundImage: `url(${assets.paperBg})` }}
    >

      {/* Outer Card Wrapper with Unique Brand Gradient Border & Elevated Shadow */}
      <div className="relative z-10 w-full max-w-[455px] p-[3.5px] rounded-[32px] bg-gradient-to-b from-amber-400 via-[#0d9488] to-brandOrange-500 shadow-[0_20px_60px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_70px_rgba(245,158,11,0.25)] transition-all duration-500 my-4 group">
        
        {/* Inner Poster Card Container */}
        <div 
          className="w-full rounded-[28px] overflow-hidden bg-cover bg-top bg-no-repeat flex flex-col bg-white"
          style={{ backgroundImage: `url(${assets.loginBg})` }}
        >
        
        {/* Top spacer to ensure Doctor banner artwork on login bg.png is fully visible */}
        <div className="w-full pt-[285px] sm:pt-[300px]" />

        {/* Login Form placed DIRECTLY over the white space of login bg.png */}
        <div className="w-full px-6 sm:px-8 pb-8 pt-2 flex flex-col justify-end">
          
          {/* Header Titles on top of white space */}
          <div className="text-center mb-4">
            <h1 className="text-slate-900 font-serif text-2xl sm:text-3xl font-extrabold tracking-wide mb-1">
              Admin Portal
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Please enter your credentials to access the console
            </p>
          </div>

          {/* Form Controls directly over white space */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* INLINE ERROR BANNER */}
            {formError && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            {/* USERNAME FIELD */}
            <div>
              <label className="block text-amber-600 font-extrabold text-[11px] tracking-widest uppercase mb-1.5">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="admin@drbharathi.com"
                  className={`w-full pl-10 pr-4 py-3 bg-[#0c1425] border rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none transition-all shadow-md ${
                    formError ? 'border-rose-500 text-rose-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                  }`}
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-amber-600 font-extrabold text-[11px] tracking-widest uppercase mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-[#0c1425] border rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none transition-all shadow-md ${
                    formError ? 'border-rose-500 text-rose-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-amber-400 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ff4d29] via-[#ff7300] to-[#ffa200] hover:from-[#ff3810] hover:to-[#ff9100] text-white font-black text-sm sm:text-base tracking-wide shadow-[0_6px_25px_rgba(255,77,41,0.45)] hover:shadow-[0_8px_30px_rgba(255,77,41,0.6)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer border border-white/20 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">
                    <Loader2 className="w-6 h-6 animate-spin text-white shrink-0" />
                    <span className="font-extrabold uppercase tracking-wider text-sm">Authenticating...</span>
                  </span>
                ) : (
                  <>
                    <span className="font-extrabold uppercase tracking-wider text-sm">Sign In</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>

  </div>
);
};

export default AdminLogin;
