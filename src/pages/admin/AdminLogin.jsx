import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Home, KeyRound } from 'lucide-react';
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden bg-[#070c18] font-sans">
      
      {/* Background Ambient Glowing Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-teal-500/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Left Return to Site Button */}
      <Link 
        to="/" 
        className="fixed top-5 left-5 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-200 hover:text-amber-400 hover:border-amber-500/50 backdrop-blur-md transition-all text-xs font-medium shadow-xl group"
      >
        <Home className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
        <span>Back to Website</span>
      </Link>

      {/* Outer Card Frame using login bg.png as Poster */}
      <div 
        className="relative z-10 w-full max-w-[460px] rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] border border-amber-500/40 overflow-hidden bg-cover bg-top bg-no-repeat flex flex-col my-4 transition-all duration-300"
        style={{ backgroundImage: `url(${assets.loginBg})` }}
      >
        
        {/* Top Spacer ensuring Doctor artwork on login bg.png remains fully visible */}
        <div className="w-full pt-[220px] sm:pt-[240px]" />

        {/* Form Container over the White Space */}
        <div className="w-full px-4 sm:px-6 pb-6 pt-2">
          
          {/* Super Premium Frosted Glass Card overlaying white space */}
          <div className="bg-white/92 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.12)] relative z-10 transition-all">
            
            {/* Top Golden Emblem Shield Badge */}
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 p-0.5 mx-auto mb-3 shadow-[0_4px_18px_rgba(245,158,11,0.35)] flex items-center justify-center">
              <div className="w-full h-full bg-[#0c1425] rounded-full flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Header Titles */}
            <div className="text-center mb-5">
              <span className="text-amber-600 font-serif tracking-widest text-[10px] font-bold uppercase block mb-0.5">
                Dr. Bharathi's Homeo Care
              </span>
              
              <h1 className="text-slate-900 font-serif text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
                Admin Portal
              </h1>
              
              <p className="text-slate-600 text-xs font-medium">
                Please enter your credentials to access the console
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* USERNAME FIELD */}
              <div>
                <label className="flex items-center gap-1.5 text-amber-700 font-extrabold text-[11px] tracking-wider uppercase mb-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Username</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@drbharathi.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#0c1425] border border-slate-700/80 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 transition-all shadow-md font-medium"
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label className="flex items-center gap-1.5 text-amber-700 font-extrabold text-[11px] tracking-wider uppercase mb-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Password</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[#0c1425] border border-slate-700/80 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 transition-all shadow-md font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-amber-400 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* VIBRANT GOLDEN SIGN IN BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-[0_6px_25px_rgba(245,158,11,0.45)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.6)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
