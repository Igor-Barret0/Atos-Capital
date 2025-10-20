/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      colors: {
        'atos-red': '#5E120F',
        'atos-dark-blue': '#1E3A8A',
        'atos-gray': '#6B7280',
        'atos-light-gray': '#F3F4F6',
        'atos-dark-gray': '#374151',
        'atos-blue-dark': '#18202B',
      },
    },
  },
  plugins: [],
}
