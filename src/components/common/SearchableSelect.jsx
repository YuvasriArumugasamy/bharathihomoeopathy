import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

/**
 * SearchableSelect - Reusable modern dropdown with type-to-search functionality.
 * Perfect for Country, State, and large lists with instant real-time filtering.
 */
export default function SearchableSelect({
  value = '',
  onChange,
  options = [], // Can be string[] or object[]: [{ label: string, value: string, flag?: string, group?: string }]
  placeholder = 'Select option',
  searchPlaceholder = 'Type to search...',
  disabled = false,
  error = '',
  className = '',
  id
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to [{ label, value, flag, group }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return {
      label: opt.label || opt.name || opt.value,
      value: opt.value || opt.name || opt.label,
      flag: opt.flag || '',
      group: opt.group || ''
    };
  });

  // Find currently selected option
  const selectedOption = normalizedOptions.find(
    (opt) => opt.value?.toLowerCase() === value?.toLowerCase() || opt.label?.toLowerCase() === value?.toLowerCase()
  );

  // Filter options based on search query
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optValue) => {
    if (onChange) {
      onChange(optValue);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full h-[48px] px-4 py-3 bg-white border ${
          error
            ? 'border-rose-400 ring-2 ring-rose-200'
            : isOpen
            ? 'border-brandOrange-500 ring-4 ring-orange-500/10'
            : 'border-slate-200/90 hover:border-slate-300'
        } rounded-2xl text-xs font-bold text-slate-900 shadow-2xs flex items-center justify-between transition-all duration-200 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-left`}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.flag && <span>{selectedOption.flag}</span>}
              <span className="text-slate-900">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-brandOrange-500' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[260px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-[9999] animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input Bar */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brandOrange-500 focus:ring-2 focus:ring-orange-500/15 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-[220px] overflow-y-auto space-y-0.5 custom-scroll">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected =
                  opt.value?.toLowerCase() === value?.toLowerCase() ||
                  opt.label?.toLowerCase() === value?.toLowerCase();

                return (
                  <button
                    key={`${opt.value}-${opt.label}`}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs flex items-center justify-between text-left transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 text-brandOrange-600 font-extrabold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-bold'
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      {opt.flag && <span>{opt.flag}</span>}
                      <span>{opt.label}</span>
                    </span>

                    {isSelected && <Check className="w-3.5 h-3.5 text-brandOrange-500 shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 font-semibold">
                No matching results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
