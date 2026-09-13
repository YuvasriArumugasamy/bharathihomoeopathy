import { useState, useEffect } from 'react';

// Live indicative benchmark conversion rates against Indian Rupee (INR)
export const EXCHANGE_RATES = {
  INR: { rate: 1, symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  USD: { rate: 0.0118, symbol: '$', code: 'USD', name: 'US Dollar' },
  AED: { rate: 0.0435, symbol: 'AED ', code: 'AED', name: 'UAE Dirham' },
  EUR: { rate: 0.0109, symbol: '€', code: 'EUR', name: 'Euro' },
  GBP: { rate: 0.0093, symbol: '£', code: 'GBP', name: 'British Pound' },
  CAD: { rate: 0.0161, symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  AUD: { rate: 0.0182, symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  SGD: { rate: 0.0159, symbol: 'S$', code: 'SGD', name: 'Singapore Dollar' }
};

export const getCurrencyByCountry = (country) => {
  if (!country) return EXCHANGE_RATES.INR;
  const c = country.trim().toLowerCase();

  if (c === 'india') return EXCHANGE_RATES.INR;

  if (c.includes('united states') || c.includes('usa') || c === 'us') {
    return EXCHANGE_RATES.USD;
  }
  if (c.includes('emirates') || c.includes('uae') || c.includes('dubai') || c.includes('saudi') || c.includes('qatar') || c.includes('oman') || c.includes('kuwait') || c.includes('bahrain')) {
    return EXCHANGE_RATES.AED;
  }
  if (c.includes('united kingdom') || c.includes('uk') || c.includes('britain') || c.includes('england') || c.includes('scotland')) {
    return EXCHANGE_RATES.GBP;
  }
  if (c.includes('canada')) {
    return EXCHANGE_RATES.CAD;
  }
  if (c.includes('australia') || c.includes('new zealand')) {
    return EXCHANGE_RATES.AUD;
  }
  if (c.includes('singapore') || c.includes('malaysia')) {
    return EXCHANGE_RATES.SGD;
  }
  if (
    c.includes('germany') || c.includes('france') || c.includes('italy') ||
    c.includes('spain') || c.includes('netherlands') || c.includes('ireland') ||
    c.includes('switzerland') || c.includes('sweden') || c.includes('belgium') ||
    c.includes('austria') || c.includes('norway') || c.includes('denmark')
  ) {
    return EXCHANGE_RATES.EUR;
  }

  // Fallback for international visitors
  return EXCHANGE_RATES.USD;
};

export const convertINR = (inrAmount, targetCurrencyCode) => {
  const numericINR = Number(inrAmount) || 0;
  const target = EXCHANGE_RATES[targetCurrencyCode] || EXCHANGE_RATES.INR;
  return Number((numericINR * target.rate).toFixed(2));
};

export const formatCurrencyDisplay = (inrAmount, countryName) => {
  const currentCountry = countryName || (typeof window !== 'undefined' ? localStorage.getItem('user_country') : 'India') || 'India';
  const target = getCurrencyByCountry(currentCountry);
  const numericINR = Math.round(Number(inrAmount) || 0);

  if (target.code === 'INR') {
    return {
      isForeign: false,
      primary: `₹${numericINR}`,
      secondary: null,
      symbol: '₹',
      code: 'INR'
    };
  }

  const converted = convertINR(numericINR, target.code);
  return {
    isForeign: true,
    primary: `₹${numericINR}`,
    secondary: `~ ${target.symbol}${converted} ${target.code}`,
    convertedValue: converted,
    symbol: target.symbol,
    code: target.code,
    country: currentCountry
  };
};

export const useCurrency = () => {
  const [country, setCountry] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_country') || 'India';
    }
    return 'India';
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('user_country') || 'India';
      setCountry(saved);
    };

    window.addEventListener('country_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('country_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const currency = getCurrencyByCountry(country);

  const format = (inrAmount) => formatCurrencyDisplay(inrAmount, country);

  return {
    country,
    currency,
    isForeign: currency.code !== 'INR',
    format
  };
};

export default {
  EXCHANGE_RATES,
  getCurrencyByCountry,
  convertINR,
  formatCurrencyDisplay,
  useCurrency
};
