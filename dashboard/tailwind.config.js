/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        accent: '#2563EB',
        'deep-black': '#09090B',
        'metallic-white': '#FAFAFA',
        'glass': 'rgba(255, 255, 255, 0.02)',
        zinc: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          800: '#27272A',
          900: '#18181B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-outfit)'],
      },
      boxShadow: {
        'nuclear': '0 0 0 1px rgba(0,0,0,0.05), 0 20px 50px -12px rgba(0,0,0,0.1)',
        'premium': '0 0 0 1px rgba(0,0,0,0.02), 0 10px 30px -5px rgba(0,0,0,0.03)',
      },
      borderRadius: {
        '4xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
