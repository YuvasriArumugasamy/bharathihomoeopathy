import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Clock, MessageCircle, ChevronDown } from 'lucide-react';

export const TopContactBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCountry, setUserCountry] = useState(localStorage.getItem('user_country') || 'India');

  useEffect(() => {
    const handleStorageChange = () => {
      setUserCountry(localStorage.getItem('user_country') || 'India');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('country_changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('country_changed', handleStorageChange);
    }
  }, []);



  return (
    <div className="bg-[#236888] text-white text-xs py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8 border-b border-[#1b536d] w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 w-full">
        
        {/* Country / Region Banner Button */}
        <div className="flex items-center justify-center sm:justify-start flex-1 min-w-0">
          <button
            onClick={() => window.dispatchEvent(new Event('open_country_modal'))}
            className="inline-flex items-center gap-1.5 font-bold text-white tracking-wider text-[10px] sm:text-[11.5px] cursor-pointer hover:text-amber-300 transition-colors group select-none whitespace-nowrap"
          >
            <span>SELECT YOUR COUNTRY / REGION</span>
            <span className="text-amber-300 group-hover:translate-x-0.5 transition-transform shrink-0">👉</span>
          </button>
        </div>

        {/* Right: Country / Currency Selector */}
        <div className="flex items-center justify-end shrink-0">
          <button 
            onClick={() => window.dispatchEvent(new Event('open_country_modal'))}
            className="flex items-center gap-1 sm:gap-1.5 text-slate-200 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="font-semibold text-[10px] sm:text-xs tracking-wide">
              {userCountry === 'India' ? 'INR' : 'USD'} 
              <span className="hidden sm:inline"> ({userCountry})</span>
            </span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

      </div>
    </div>
  );
};
