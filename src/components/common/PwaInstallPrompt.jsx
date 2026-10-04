import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, X, ShieldCheck, Sparkles } from 'lucide-react';
import assets from '../../assets';

export const PwaInstallPrompt = () => {
  const location = useLocation();
  const isAdmin = location.pathname.toLowerCase().startsWith('/admin');

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  const sessionDismissKey = isAdmin ? 'pwa_admin_prompt_dismissed' : 'pwa_prompt_dismissed';

  useEffect(() => {
    // Sync manifest link based on current path
    const manifestEl = document.getElementById('app-manifest') || document.querySelector('link[rel="manifest"]');
    if (manifestEl) {
      manifestEl.setAttribute('href', isAdmin ? '/manifest-admin.json' : '/manifest.json');
    }
    if (isAdmin) {
      localStorage.setItem('dr_bharathi_pwa_mode', 'admin');
    }
  }, [isAdmin]);

  useEffect(() => {
    // Check if already dismissed in this session
    if (sessionStorage.getItem(sessionDismissKey)) {
      return;
    }

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setInstalled(true);
      return;
    }

    // iOS detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice && !window.navigator.standalone) {
      setIsIos(true);
      const timer = setTimeout(() => setShowPrompt(true), 3500);
      return () => clearTimeout(timer);
    }

    // Android / Desktop Chrome PWA prompt handler
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      if (isAdmin) {
        localStorage.setItem('dr_bharathi_pwa_mode', 'admin');
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [sessionDismissKey, isAdmin]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Ensure manifest is set correctly right before triggering install
    const manifestEl = document.getElementById('app-manifest') || document.querySelector('link[rel="manifest"]');
    if (manifestEl) {
      manifestEl.setAttribute('href', isAdmin ? '/manifest-admin.json' : '/manifest.json');
    }

    if (isAdmin) {
      localStorage.setItem('dr_bharathi_pwa_mode', 'admin');
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      if (isAdmin) {
        localStorage.setItem('dr_bharathi_pwa_mode', 'admin');
      }
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem(sessionDismissKey, 'true');
  };

  if (!showPrompt || installed) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up font-serif">
      <div 
        className={`text-white p-4 sm:p-5 rounded-3xl shadow-2xl border backdrop-blur-xl flex items-center justify-between gap-4 ${
          isAdmin 
            ? 'bg-gradient-to-r from-[#0c1425] via-[#15233c] to-[#0c1425] border-amber-400/40 shadow-black/40 ring-1 ring-amber-400/20' 
            : 'bg-gradient-to-r from-[#0b344d] via-[#144766] to-[#0b344d] border-white/20'
        }`}
      >
        
        {/* App Logo */}
        <div className={`w-12 h-12 rounded-2xl p-1 shrink-0 overflow-hidden shadow-md flex items-center justify-center ${isAdmin ? 'bg-amber-400' : 'bg-white'}`}>
          <img 
            src={assets.logo} 
            alt="Dr. Bharathi App" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5 leading-tight">
            <span>{isAdmin ? 'Install Dr. Bharathi Admin App' : 'Install Dr. Bharathi App'}</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
              isAdmin ? 'bg-amber-400 text-slate-900' : 'bg-amber-400 text-[#0b344d]'
            }`}>
              {isAdmin ? 'ADMIN' : 'FAST'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-2">
            {isIos 
              ? 'Tap the Share icon & select "Add to Home Screen"' 
              : isAdmin
                ? 'Install on your phone for direct access to dispensary orders, consultations & alerts'
                : 'Add to your Home Screen for instant appointments & order tracking'}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          {!isIos && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className={`px-3 py-2 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                isAdmin 
                  ? 'bg-gradient-to-r from-amber-500 to-brandOrange-500 hover:from-amber-600 hover:to-brandOrange-600 text-white' 
                  : 'bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Install' : 'Install'}</span>
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default PwaInstallPrompt;
