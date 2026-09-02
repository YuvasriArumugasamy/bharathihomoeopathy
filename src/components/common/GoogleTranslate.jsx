import React, { useEffect, useState, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ta', label: 'TA', name: 'Tamil' },
  { code: 'hi', label: 'HI', name: 'Hindi' },
  { code: 'ml', label: 'ML', name: 'Malayalam' },
  { code: 'te', label: 'TE', name: 'Telugu' },
  { code: 'kn', label: 'KN', name: 'Kannada' },
  { code: 'mr', label: 'MR', name: 'Marathi' },
  { code: 'gu', label: 'GU', name: 'Gujarati' },
  { code: 'bn', label: 'BN', name: 'Bengali' },
  { code: 'pa', label: 'PA', name: 'Punjabi' },
  { code: 'ur', label: 'UR', name: 'Urdu' }
];

export const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,bn,gu,hi,kn,ml,mr,pa,ta,te,ur',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Check local storage or cookies for selected language to update the UI label
    const checkGoogleCookie = () => {
      const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
      if (match && match[1]) {
        const langCode = match[1].split('/').pop();
        const found = languages.find(l => l.code === langCode);
        if (found) setCurrentLang(found.label);
      }
    };
    
    // Small delay to allow cookie to be set after reload
    setTimeout(checkGoogleCookie, 500);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang.label);
    setIsOpen(false);
    
    // Most reliable way to trigger Google Translate is via cookie + reload
    // Set cookie for current domain
    document.cookie = `googtrans=/en/${lang.code}; path=/`;
    document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${window.location.hostname}`;
    
    // Reload to apply translation automatically
    window.location.reload();
  };

  return (
    <div className="relative notranslate" ref={dropdownRef}>
      {/* Hidden original widget (must not use display:none or Google won't render it) */}
      <div 
        id="google_translate_element" 
        className="opacity-0 absolute w-px h-px overflow-hidden pointer-events-none z-[-1]"
      ></div>
      
      {/* Custom Compact Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
      >
        <Globe className="w-4 h-4 text-slate-600" />
        <span className="text-xs font-bold text-slate-700">{currentLang}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-[1000] py-2 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-orange-50 transition-colors ${
                currentLang === lang.label ? 'text-brandOrange-600 font-bold bg-orange-50/50' : 'text-slate-700 font-medium'
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-[10px] text-slate-400 opacity-60">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
