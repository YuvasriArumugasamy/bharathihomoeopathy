import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Home } from 'lucide-react';
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
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/admin';

  // If already logged in as admin, redirect directly to admin dashboard
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

  const handleFillDemo = () => {
    setUsername('admin@drbharathi.com');
    setPassword('admin123');
    showToast('Demo admin credentials populated!', 'info');
  };

  const handleForgotPassword = () => {
    showToast('Password reset link sent to admin recovery email address.', 'info');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden bg-[#060a14] font-sans">
      
      {/* Background Glows */}
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

      {/* Center Poster Container with login bg.png as Background Frame */}
      <div className="relative z-10 w-full max-w-[460px] bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-amber-500/40 overflow-hidden flex flex-col my-6">
        
        {/* Top Section: Doctor Banner Artwork (from login bg.png) */}
        <div className="relative w-full bg-slate-50 flex flex-col items-center">
          <img 
            src={assets.loginBg} 
            alt="Dr Bharathi Homeo Banner" 
            className="w-full h-auto object-cover block"
          />
        </div>

        {/* Bottom Section: White Space Area housing the Dark Admin Login Portal Form */}
        <div className="relative w-full bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] p-4 sm:p-5 -mt-6">
          
          {/* Dark Admin Portal Form Container overlaying the white space */}
          <div className="bg-[#0c1425] border border-amber-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl text-center backdrop-blur-md relative z-10">
            
            {/* Emblem Circular Logo */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-amber-500/70 bg-[#0c1425] p-1.5 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <img 
                src={assets.logo} 
                alt="Dr. Bharathi Logo" 
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Header Titles */}
            <div className="mb-6">
              <h3 className="text-amber-400 font-serif tracking-widest text-[11px] font-bold uppercase mb-0.5">
                Dr. Bharathi's Homeo Care
              </h3>
              <p className="text-[9px] tracking-[0.2em] font-semibold text-amber-500/70 uppercase mb-3">
                Smart Health Management
              </p>
              
              <h1 className="text-white font-serif text-2xl sm:text-3xl font-bold tracking-wide mb-1">
                Admin Portal
              </h1>
              <p className="text-slate-400 text-xs font-normal">
                Please enter your credentials to access the console
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* USERNAME FIELD */}
              <div>
                <label className="block text-amber-500 font-bold text-[10px] tracking-widest uppercase mb-1.5">
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
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#131d31] border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label className="block text-amber-500 font-bold text-[10px] tracking-widest uppercase mb-1.5">
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
                    className="w-full pl-10 pr-10 py-2.5 bg-[#131d31] border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-amber-400 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* OPTIONS ROW */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition text-[11px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-amber-400 hover:text-amber-300 font-medium transition hover:underline text-[11px]"
                >
                  Forgot Password?
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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

            {/* Quick Fill Demo Credentials */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] text-slate-400 hover:text-amber-400 transition bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Fill Demo Admin Credentials</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
