/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFBF7',
          100: '#FFF4EC',
          200: '#FDE8DC',
        },
        blush: {
          100: '#FFE4EC',
          200: '#FFC9DA',
          300: '#FFA8C5',
          400: '#FF7FA9',
          500: '#FF5C92',
        },
        rouge: {
          400: '#F2547D',
          500: '#E23E63',
          600: '#C42B4C',
          700: '#9B1F3A',
        },
        plum: {
          700: '#5B2340',
          800: '#43182F',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Quicksand"', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(226, 62, 99, 0.35)',
        glow: '0 0 0 1px rgba(255,255,255,0.5) inset, 0 20px 50px -20px rgba(226,62,99,0.55)',
        lift: '0 24px 60px -24px rgba(155, 31, 58, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.85' },
          '90%': { opacity: '0.5' },
          '100%': { transform: 'translate3d(var(--drift, 0px), -110vh, 0) rotate(var(--spin, 20deg))', opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.85)' },
          '50%': { opacity: '0.9', transform: 'scale(1.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        floatUp: 'floatUp linear infinite',
        twinkle: 'twinkle ease-in-out infinite',
        shimmer: 'shimmer 8s ease infinite',
      },
    },
  },
  plugins: [],
}
