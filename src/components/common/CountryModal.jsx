import React, { useState, useEffect } from 'react';
import { X, Globe2, ChevronDown, Check, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import modalBg from '../../assets/images/country-modal-bg.jpg';
import { countries } from '../../data/countries';

export const CountryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if country is already selected
    const savedCountry = localStorage.getItem('user_country');
    if (!savedCountry) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            () => console.log("Location access granted."),
            () => console.log("Location access denied or failed.")
          );
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open_country_modal', handleOpenModal);
    return () => window.removeEventListener('open_country_modal', handleOpenModal);
  }, []);

  const handleContinue = () => {
    localStorage.setItem('user_country', selectedCountry);
    window.dispatchEvent(new Event('country_changed'));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative border border-slate-100 animate-in zoom-in-95 duration-300 max-h-[92vh] md:max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column - Image */}
        <div className="w-full md:w-1/2 bg-slate-900 relative h-[220px] sm:h-[260px] md:h-auto md:min-h-[500px] shrink-0 overflow-hidden">
          <img 
            src={modalBg} 
            alt="World Map Background" 
            className="w-full h-full object-cover object-center rounded-none shadow-none"
          />
        </div>

        {/* Right Column - Luxury Selection Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white relative">
          
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0b344d] via-brandOrange-500 to-amber-400" />

          {/* Header Section */}
          <div className="space-y-4 pt-2">
            
            {/* Worldwide Delivery Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/70 text-brandOrange-600 text-xs font-black tracking-wide shadow-2xs">
              <Globe2 className="w-3.5 h-3.5 text-brandOrange-500 animate-spin-slow" />
              <span>GLOBAL HOMEOPATHY CARE</span>
            </div>

            {/* Main Heading */}
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans leading-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandOrange-500 via-orange-600 to-amber-500 font-serif italic">Country</span>
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              We ship authentic homeopathic remedies & wellness formulations straight to your doorstep worldwide.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Custom Shipping</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Authentic</span>
              </div>
            </div>
          </div>

          {/* Selection & Dropdown Form */}
          <div className="space-y-5 my-6">
            <div className="space-y-2">
              <label htmlFor="country" className="flex items-center justify-between text-xs font-black uppercase text-slate-800 tracking-wider">
                <span>Select Your Region</span>
                <span className="text-[10px] text-slate-400 font-semibold normal-case">80+ Countries</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-brandOrange-500/60 focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 outline-none transition-all duration-200 bg-white text-left shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-brandOrange-600 font-black shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-slate-900 font-extrabold text-xs sm:text-sm truncate">{selectedCountry}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-brandOrange-500 transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180 text-brandOrange-500' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full bottom-full mb-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-56 overflow-y-auto border-slate-200/90 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <ul className="divide-y divide-slate-50">
                      {countries.map((countryName) => (
                        <li key={countryName}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCountry(countryName);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50/70 transition-colors text-xs font-bold ${
                              selectedCountry === countryName ? 'bg-orange-50 text-brandOrange-600 font-black' : 'text-slate-700'
                            }`}
                          >
                            <span>{countryName}</span>
                            {selectedCountry === countryName && (
                              <Check className="w-4 h-4 text-brandOrange-500 shrink-0" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Premium CTA Button */}
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-brandOrange-500 via-orange-600 to-[#0b344d] hover:scale-[1.02] active:scale-95 rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-200 cursor-pointer"
            >
              <span>Explore Products & Prices</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Security Note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>You can change your shipping region anytime from header</span>
          </div>

        </div>
      </div>
    </div>
  );
};
