import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import assets from '../../assets';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('admin@drbharathi.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/admin';

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      showToast('Please enter both username/email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await login(username.trim(), password);
      setLoading(false);

      if (res.success) {
        if (res.user?.role === 'admin') {
          showToast('Welcome to Admin Portal!', 'success');
          navigate(redirectUrl, { replace: true });
        } else {
          showToast('Access Denied: Account does not have Administrator privileges.', 'error');
        }
      } else {
        showToast(res.message || 'Invalid admin credentials', 'error');
      }
    } catch (err) {
      setLoading(false);
      showToast('Login failed. Please try again.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden bg-slate-950 font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Left Return to Site Button */}
      <Link 
        to="/" 
        className="fixed top-5 left-5 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-200 hover:text-amber-400 hover:border-amber-500/50 backdrop-blur-md transition-all text-xs font-medium shadow-lg"
      >
        <Home className="w-4 h-4 text-amber-500" />
        <span>Back to Website</span>
      </Link>

      {/* Outer Card Container using login bg.png as Background */}
      <div 
        className="relative z-10 w-full max-w-[450px] rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-amber-500/30 overflow-hidden bg-cover bg-top bg-no-repeat flex flex-col my-4"
        style={{ backgroundImage: `url(${assets.loginBg})` }}
      >
        
        {/* Top spacer to ensure Doctor banner artwork on login bg.png is fully visible */}
        <div className="w-full pt-[285px] sm:pt-[300px]" />

        {/* Login Form placed DIRECTLY over the white space of login bg.png */}
        <div className="w-full px-6 sm:px-8 pb-8 pt-2 flex flex-col justify-end">
          
          {/* Header Titles on top of white space */}
          <div className="text-center mb-5">
            <h1 className="text-slate-900 font-serif text-2xl sm:text-3xl font-extrabold tracking-wide mb-1">
              Admin Portal
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Please enter your credentials to access the console
            </p>
          </div>

          {/* Form Controls directly over white space */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* USERNAME FIELD */}
            <div>
              <label className="block text-amber-600 font-extrabold text-[11px] tracking-widest uppercase mb-1.5">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@drbharathi.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0c1425] border border-slate-800 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-md"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#0c1425] border border-slate-800 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-md"
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
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
