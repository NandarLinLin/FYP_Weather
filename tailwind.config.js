/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF', // White
        secondary: '#FFD700', // Yellow
        accent: '#FFA500', // Orange
        warm: {
          50: '#FFF9E6',
          100: '#FFF2CC',
          200: '#FFE599',
          300: '#FFD866',
          400: '#FFCB33',
          500: '#FFD700',
          600: '#E6C200',
          700: '#CCAD00',
          800: '#B39800',
          900: '#998300',
        },
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDCA7F',
          400: '#FB923C',
          500: '#FFA500',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(255, 165, 0, 0.18)',
      },
    },
  },
  plugins: [],
};
