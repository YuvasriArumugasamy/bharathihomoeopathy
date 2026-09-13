import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopContactBar } from '../components/common/TopContactBar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { FloatingActions } from '../components/common/FloatingActions';
import { MobileBottomBar } from '../components/common/MobileBottomBar';
import { AuthModal } from '../components/auth/AuthModal';
import { CountryModal } from '../components/common/CountryModal';
import { TrackOrderModal } from '../components/common/TrackOrderModal';
import { SymptomGuideModal } from '../components/common/SymptomGuideModal';
import { PwaInstallPrompt } from '../components/common/PwaInstallPrompt';
import { assets } from '../assets';

export const MainLayout = () => {
  const location = useLocation();
  const isShopPage = location.pathname === '/shop' || location.pathname.startsWith('/shop');
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);

  useEffect(() => {
    const handleOpenTrack = () => setTrackOrderOpen(true);
    window.addEventListener('open_track_order', handleOpenTrack);
    return () => window.removeEventListener('open_track_order', handleOpenTrack);
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col w-full pb-16 lg:pb-0"
      style={{ 
        backgroundImage: `url(${assets.paperBg})`, 
        backgroundSize: 'cover', 
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      {/* Country Selection Modal */}
      <CountryModal />

      {/* Interactive Symptom & Classical Remedy Guide Modal */}
      <SymptomGuideModal />

      {/* Live Order Tracking Modal */}
      <TrackOrderModal 
        isOpen={trackOrderOpen} 
        onClose={() => setTrackOrderOpen(false)} 
      />

      {/* Top Bar that scrolls away */}
      <TopContactBar />

      {/* Main Navbar - On Mobile Shop page, navbar scrolls away so Category/Filter bar sticks to top-0 */}
      <header className={`w-full bg-white z-50 shadow-sm ${isShopPage ? 'relative sm:sticky sm:top-0' : 'sticky top-0'}`}>
        <Navbar />
      </header>

      {/* Page Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed Right-side Quick Actions (Call, WhatsApp, Instagram) */}
      <FloatingActions />

      {/* Fixed Mobile Bottom Navigation Bar (Phone & Tablet) */}
      <MobileBottomBar />

      {/* Global Patient Auth Popup Modal (Register / Sign In) */}
      <AuthModal />

      {/* PWA Mobile App Install Banner */}
      <PwaInstallPrompt />
    </div>
  );
};

export default MainLayout;
