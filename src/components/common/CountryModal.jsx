import React, { useState, useEffect } from 'react';
import { X, Globe2, ChevronDown, Check } from 'lucide-react';
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
      // Small delay to let page load first
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Ask for geolocation to trigger the browser prompt as requested
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("Location access granted.");
              // Here you could use a reverse geocoding API to auto-select country based on lat/lng
            },
            (error) => {
              console.log("Location access denied or failed.");
            }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative animate-in zoom-in-95 duration-500 max-h-[95vh] md:max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column - Image */}
        <div className="w-full md:w-1/2 bg-slate-900 relative h-[220px] sm:h-[260px] md:h-auto md:min-h-[500px] shrink-0 overflow-hidden">
          <img 
            src={modalBg} 
            alt="World Map Background" 
            className="w-full h-full object-cover object-center rounded-none shadow-none"
          />
        </div>

        {/* Right Column - Selection Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">Choose Your Country</h3>
            <p className="text-gray-600 flex items-center justify-center gap-2 mb-2">
              We deliver worldwide. <Globe2 className="w-5 h-5 text-blue-500" />
            </p>
            <p className="text-sm text-gray-500">
              Select your country to explore products, prices & delivered to your doorstep.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 text-left">
                Select Country
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white hover:bg-gray-50 text-left shadow-sm"
                >
                  <span className="text-gray-800 font-medium">{selectedCountry}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <ul className="py-2">
                      {countries.map((countryName) => (
                        <li key={countryName}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCountry(countryName);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] transition-colors ${
                              selectedCountry === countryName ? 'bg-[#e6f0fa] text-[#0a58ca] font-medium' : 'text-gray-700'
                            }`}
                          >
                            {countryName}
                            {selectedCountry === countryName && (
                              <Check className="w-4 h-4 text-[#0a58ca]" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-[#0a58ca] hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5"
            >
              Continue
            </button>

            <p className="text-xs text-center text-gray-400 mt-6">
              You can change your country anytime from the header.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
