/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#0a0d14',
          900: '#0f172a',
          850: '#151e36',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          accent: '#d97706',
          'accent-hover': '#b45309',
          'accent-light': '#fef3c7',
          rose: '#e11d48',
          emerald: '#10b981',
          cyan: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
