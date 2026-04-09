/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F1781F',
          50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74',
          400: '#FB923C', 500: '#F1781F', 600: '#E05A0A', 700: '#BA420A',
          800: '#93340E', 900: '#772C0F', 950: '#431407',
        },
        cyan: {
          DEFAULT: '#089FA8', 50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0',
          300: '#6EE7B7', 400: '#34D399', 500: '#089FA8', 600: '#067F87',
          700: '#055F65', 800: '#044044', 900: '#022022',
        },
        purple: {
          DEFAULT: '#A12265', 50: '#FDF2F8', 100: '#FCE7F3', 200: '#FBCFE8',
          300: '#F9A8D4', 400: '#F472B6', 500: '#A12265', 600: '#811A50',
          700: '#61143C', 800: '#410D28', 900: '#210714',
        },
        success: { DEFAULT: '#78B140', 50: '#F0FDF4', 100: '#DCFCE7', 500: '#78B140', 600: '#5F8D33' },
        danger: { DEFAULT: '#E91524', 50: '#FEF2F2', 100: '#FEE2E2', 500: '#E91524', 600: '#BA111D' },
        surface: { 50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4', 400: '#A3A3A3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717' },
      },
      fontFamily: { sans: ['Poppins', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.5s ease forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.08)',
        'glass-xl': '0 24px 64px rgba(0, 0, 0, 0.12)',
        'glow-primary': '0 0 40px rgba(241, 120, 31, 0.15)',
        'glow-cyan': '0 0 40px rgba(8, 159, 168, 0.15)',
        'glow-purple': '0 0 40px rgba(161, 34, 101, 0.15)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 40% 20%, #F1781F22 0px, transparent 50%), radial-gradient(at 80% 0%, #089FA822 0px, transparent 50%), radial-gradient(at 0% 50%, #A1226522 0px, transparent 50%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
