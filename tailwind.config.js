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
        primary: { DEFAULT: '#F1781F', 50: '#FFF4EC', 100: '#FFE8D6', 200: '#FFD0AC', 300: '#FFB07A', 400: '#F8904A', 500: '#F1781F', 600: '#E05A0A', 700: '#BA420A', 800: '#93340E', 900: '#772C0F' },
        cyan: { DEFAULT: '#089FA8', 50: '#E6F8F9', 100: '#CCEFF1', 200: '#99DFE3', 300: '#66CFD5', 400: '#33BFC7', 500: '#089FA8', 600: '#067F87', 700: '#055F65', 800: '#044044', 900: '#022022' },
        purple: { DEFAULT: '#A12265', 50: '#F8E8F0', 100: '#F0D0E0', 200: '#E0A0C0', 300: '#D070A0', 400: '#C04080', 500: '#A12265', 600: '#811A50', 700: '#61143C', 800: '#410D28', 900: '#210714' },
        green: { DEFAULT: '#78B140', 50: '#F0F8E6', 100: '#E0F0CC', 200: '#C0E099', 300: '#A0D066', 400: '#8CC053', 500: '#78B140', 600: '#5F8D33', 700: '#476A26', 800: '#2F461A', 900: '#18230D' },
        red: { DEFAULT: '#E91524', 50: '#FDE8EA', 100: '#FBD0D3', 200: '#F6A0A6', 300: '#F27079', 400: '#ED404C', 500: '#E91524', 600: '#BA111D', 700: '#8C0D16', 800: '#5D080E', 900: '#2F0407' },
        gray: { DEFAULT: '#777777', 50: '#F5F5F5', 100: '#EBEBEB', 200: '#D6D6D6', 300: '#C2C2C2', 400: '#ADADAD', 500: '#777777', 600: '#555555', 700: '#333333', 800: '#1A1A1A', 900: '#0D0D0D' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
