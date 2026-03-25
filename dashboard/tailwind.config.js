/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        accent: '#2563EB', // A bit deeper blue
        'deep-black': '#09090B', // Zinc-950
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
        glow: {
          blue: '#3B82F6',
          green: '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'nuclear': '0 0 0 1px rgba(0,0,0,0.05), 0 20px 50px -12px rgba(0,0,0,0.1)',
        'premium': '0 0 0 1px rgba(0,0,0,0.02), 0 10px 30px -5px rgba(0,0,0,0.03)',
        'glass': 'inset 0 0 0 1px rgba(255,255,255,0.4), 0 8px 32px 0 rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem', // Tighter than before
        '4xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
