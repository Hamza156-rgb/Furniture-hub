/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          darkest: '#1a0f08',
          dark: '#2c1810',
          mid: '#5c3d2e',
          light: '#8b5e3c',
        },
        gold: {
          DEFAULT: '#c4956a',
          light: '#e8c99a',
        },
        cream: {
          DEFAULT: '#faf8f5',
          mid: '#f0ebe4',
          dark: '#e8ddd4',
        },
        border: '#e0d5c8',
        'text-main': '#2c1810',
        'text-mid': '#5c3d2e',
        'text-muted': '#8a7468',
        green: '#3a7c4e',
        'green-bg': '#e8f4ed',
        red: '#b05c5c',
        'red-bg': '#fae8e8',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(44,24,16,0.06)',
        'md': '0 8px 24px rgba(44,24,16,0.10)',
        'lg': '0 20px 48px rgba(44,24,16,0.15)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
