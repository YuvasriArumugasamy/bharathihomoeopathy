import React, { useState, useEffect, useRef } from 'react';
import { X, Globe2, ChevronDown, Check, Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { countries } from '../../data/countries';
import { assets } from '../../assets';

// Popular quick selection countries with flags
const POPULAR_COUNTRIES = [
  { name: 'India', flag: '🇮🇳' },
  { name: 'United States of America', label: 'USA', flag: '🇺🇸' },
  { name: 'United Kingdom', label: 'UK', flag: '🇬🇧' },
  { name: 'United Arab Emirates', label: 'UAE', flag: '🇦🇪' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Australia', flag: '🇦🇺' }
];

export const CountryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

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
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open_country_modal', handleOpenModal);
    return () => window.removeEventListener('open_country_modal', handleOpenModal);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContinue = () => {
    localStorage.setItem('user_country', selectedCountry);
    window.dispatchEvent(new Event('country_changed'));
    setIsOpen(false);
  };

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1727]/75 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      {/* Modal Card Box */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100/80 overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Brand Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />

        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">

          {/* Header Section */}
          <div className="text-center space-y-2">
            
            {/* Globe Icon Badge */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0b344d] to-[#1d546c] text-white flex items-center justify-center shadow-lg shadow-[#0b344d]/20 ring-4 ring-sky-500/10 relative">
              <Globe2 className="w-7 h-7 text-sky-300 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brandOrange-500 flex items-center justify-center text-[9px] font-black text-white shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Choose Your Country
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Select your destination to explore authentic products, local pricing, & doorstep courier delivery.
            </p>

            {/* Worldwide Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Worldwide Express Shipping Available</span>
            </div>
          </div>

          {/* Quick Select Pills */}
          <div className="space-y-2 pt-1">
            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider text-left">
              Popular Destinations
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_COUNTRIES.map((c) => {
                const isSelected = selectedCountry === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c.name);
                      setIsDropdownOpen(false);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#0b344d] text-white border-[#0b344d] shadow-sm scale-105'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.label || c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Selection Dropdown */}
          <div className="space-y-2 text-left relative" ref={dropdownRef}>
            <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
              Select Country / Region
            </label>
            
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border border-slate-200/90 hover:border-brandOrange-500 focus:outline-none focus:ring-4 focus:ring-brandOrange-500/10 bg-slate-50/60 hover:bg-white text-left transition-all duration-200 shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Globe2 className="w-4 h-4 text-brandOrange-500 shrink-0" />
                <span className="text-slate-900 font-extrabold text-xs sm:text-sm truncate">
                  {selectedCountry}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-brandOrange-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-50 left-0 right-0 bottom-full mb-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-150">
                
                {/* Search Box */}
                <div className="relative mb-2 shrink-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brandOrange-500 focus:bg-white"
                  />
                </div>

                {/* Country List */}
                <ul className="overflow-y-auto space-y-0.5 max-h-48 pr-1 no-scrollbar">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((countryName) => {
                      const isSelected = selectedCountry === countryName;
                      return (
                        <li key={countryName}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCountry(countryName);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-brandOrange-50 text-brandOrange-600 font-black'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{countryName}</span>
                            {isSelected && <Check className="w-4 h-4 text-brandOrange-600 shrink-0" />}
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <li className="p-3 text-center text-xs text-slate-400 font-medium">
                      No country found matching "{searchQuery}"
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-brandOrange-500 via-amber-500 to-brandOrange-600 hover:from-brandOrange-600 hover:to-amber-600 active:scale-98 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 cursor-pointer"
          >
            <span>Continue Shopping in {selectedCountry}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Footer Note */}
          <p className="text-[11px] text-center text-slate-400 font-medium">
            You can change your country anytime from the top bar.
          </p>

        </div>
      </div>
    </div>
  );
};
