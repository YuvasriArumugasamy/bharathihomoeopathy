import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, PlusCircle, Check } from 'lucide-react';
import assets from '../../assets';

export const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    if (sessionStorage.getItem('pwa_prompt_dismissed')) {
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
      // Show iOS prompt after a short delay
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

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || installed) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slide-up font-serif">
      <div className="bg-gradient-to-r from-[#0b344d] via-[#144766] to-[#0b344d] text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl flex items-center justify-between gap-4">
        
        {/* App Logo */}
        <div className="w-12 h-12 rounded-2xl bg-white p-1 shrink-0 overflow-hidden shadow-md flex items-center justify-center">
          <img 
            src={assets.logo} 
            alt="Dr. Bharathi App" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5 leading-tight">
            <span>Install Dr. Bharathi App</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-[#0b344d] text-[9px] font-black uppercase">FAST</span>
          </h4>
          <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-2">
            {isIos 
              ? 'Tap the Share icon & select "Add to Home Screen"' 
              : 'Add to your Home Screen for instant appointments & order tracking'}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          {!isIos && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="px-3 py-2 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
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
