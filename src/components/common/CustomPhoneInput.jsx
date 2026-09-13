import React from 'react';
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Support both ESM and CJS default exports cleanly in Vite
const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

/**
 * CustomPhoneInput - Professional International Phone Input Component
 * Features:
 * - Country Flag + Name + Calling Code selector
 * - Searchable countries list
 * - Default India (+91) with popular regional quick selections
 * - Styled to match Dr. Bharathi's Homeo Care UI (rounded-2xl, brand orange focus, clean typography)
 */
export default function CustomPhoneInput({
  value = '',
  onChange,
  country = 'in',
  placeholder = 'Enter phone number',
  disabled = false,
  required = false,
  id,
  name = 'phone',
  className = '',
  error = '',
  label = '',
  icon = null
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="custom-phone-wrapper relative group/phone">
        <PhoneInput
          country={country}
          value={value}
          onChange={(phone, countryData, e, formattedValue) => {
            if (onChange) {
              // Pass standard parameters for both direct string state or object state
              onChange(phone, countryData, formattedValue);
            }
          }}
          enableSearch={true}
          searchPlaceholder="Search country or code..."
          searchNotFound="No country found"
          countryCodeEditable={false}
          disabled={disabled}
          placeholder={placeholder}
          preferredCountries={['in', 'ae', 'us', 'gb', 'sg', 'my', 'lk', 'ca', 'au', 'sa']}
          inputProps={{
            name,
            id: id || name,
            required,
            autoComplete: 'tel'
          }}
          containerClass="!w-full !relative"
          inputClass={`!w-full !h-[48px] !pl-[56px] !pr-4 !bg-white !border ${
            error ? '!border-rose-400 !ring-2 !ring-rose-200' : '!border-slate-200/90 hover:!border-slate-300'
          } !rounded-2xl !text-[13px] !font-bold !text-slate-900 !placeholder-slate-400 !shadow-2xs focus:!border-brandOrange-500 focus:!ring-4 focus:!ring-brandOrange-500/10 !transition-all !duration-200`}
          buttonClass="!bg-slate-50/90 !border !border-slate-200/90 !border-r-slate-200/80 !rounded-l-2xl hover:!bg-slate-100 !transition-colors !w-[48px]"
          dropdownClass="!w-[300px] sm:!w-[340px] !max-w-[calc(100vw-32px)] !max-h-[260px] !bg-white !rounded-2xl !shadow-2xl !border !border-slate-200/90 !mt-2 !overflow-y-auto !text-xs !font-bold !text-slate-800 !p-1.5 custom-phone-scroll !z-[9999] !left-0 !right-auto"
          searchClass="!sticky !top-0 !bg-white !p-2 !z-10 !border-b !border-slate-100"
        />
      </div>

      {error && (
        <p className="text-[11px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
