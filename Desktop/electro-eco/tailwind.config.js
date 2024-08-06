/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'linear-wipe': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'linear-wipe': 'linear-wipe 2s linear infinite',
      },
    },
  },
  
  plugins: [
    require('daisyui'),
  ],




  
}