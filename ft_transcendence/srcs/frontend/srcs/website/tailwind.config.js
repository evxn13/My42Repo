/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "../**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'fullscreen': '1870px',
        'petit': {'raw': '(max-height: 870px)'},
        'mobile': {'max': '1100px'},
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.glass-button': {
          '@apply w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 active:bg-white/50 transition-all duration-100 text-xl font-bold': {},
        },
      })
    }
  ],
  // Force CSS regeneration
}