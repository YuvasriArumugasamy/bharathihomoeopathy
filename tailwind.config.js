/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3daeb',
          300: '#95bfdd',
          400: '#619ecb',
          500: '#3d81b6',
          600: '#2d6799',
          700: '#25527c',
          800: '#1b3a57',
          900: '#0f2438',
          950: '#0a1724',
        },
        brandOrange: {
          50: '#fff8ed',
          100: '#feefd6',
          200: '#fddcaa',
          300: '#fcc373',
          400: '#faa038',
          500: '#f97e12',
          600: '#ea6108',
          700: '#c24709',
          800: '#9a3810',
          900: '#7c3010',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 20px 25px -5px rgba(15, 36, 56, 0.1), 0 8px 10px -6px rgba(15, 36, 56, 0.05)',
      }
    },
  },
  plugins: [],
}
