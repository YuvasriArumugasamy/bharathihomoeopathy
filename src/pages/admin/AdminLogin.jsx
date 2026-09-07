import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import assets from '../../assets';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user, isAuthenticated, isAdmin } = useAuth();
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950 font-sans">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
        style={{ 
          backgroundImage: `url(${assets.loginBg || assets.homeopathyAuth || assets.shopBg})` 
        }}
      />
      {/* Dark Blur & Ambient Gradients Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70 backdrop-blur-[3px]" />
      
      {/* Subtle Golden Radial Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Left Return to Site Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-700/60 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 backdrop-blur-md transition-all text-xs font-medium"
      >
        <Home className="w-4 h-4" />
        <span>Back to Website</span>
      </Link>

      {/* Center Admin Login Portal Card */}
      <div className="relative z-10 w-full max-w-[430px] bg-[#0c1425]/90 backdrop-blur-xl border border-amber-500/35 rounded-2xl p-7 sm:p-9 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-center transition-all duration-300">
        
        {/* Emblem Circular Logo */}
        <div className="relative w-20 h-20 rounded-full border-2 border-amber-500/70 bg-[#0c1425] p-2 flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(245,158,11,0.25)] group">
          <img 
            src={assets.logo} 
            alt="Dr. Bharathi Logo" 
            className="w-full h-full object-cover rounded-full filter contrast-125"
          />
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Header Titles */}
        <div className="mb-7">
          <h3 className="text-amber-400 font-serif tracking-widest text-xs font-bold uppercase mb-1">
            Dr. Bharathi's Homeo Care
          </h3>
          <p className="text-[10px] tracking-[0.2em] font-semibold text-amber-500/70 uppercase mb-4">
            Smart Health Management
          </p>
          
          <h1 className="text-white font-serif text-3xl font-bold tracking-wide mb-2">
            Admin Portal
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-normal">
            Please enter your credentials to access the console
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          
          {/* USERNAME FIELD */}
          <div>
            <label className="block text-amber-500 font-bold text-[11px] tracking-widest uppercase mb-2">
              Username
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or Email"
                className="w-full pl-11 pr-4 py-3 bg-[#131d31] border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label className="block text-amber-500 font-bold text-[11px] tracking-widest uppercase mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-[#131d31] border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-amber-400 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* OPTIONS ROW (Remember Me & Forgot Password) */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950 accent-amber-500 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-amber-400 hover:text-amber-300 font-medium transition hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm sm:text-base shadow-[0_4px_25px_rgba(245,158,11,0.35)] transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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

        {/* Demo Credentials Quick-Fill Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] text-slate-400 hover:text-amber-400 transition bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Click here to fill Demo Admin credentials</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
