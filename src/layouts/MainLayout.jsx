import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopContactBar } from '../components/common/TopContactBar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { FloatingActions } from '../components/common/FloatingActions';
import { MobileBottomBar } from '../components/common/MobileBottomBar';
import { AuthModal } from '../components/auth/AuthModal';
import { CountryModal } from '../components/common/CountryModal';
import { assets } from '../assets';

export const MainLayout = () => {
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

      {/* Top Bar that scrolls away */}
      <TopContactBar />

      {/* Main Navbar */}
      <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
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
    </div>
  );
};
