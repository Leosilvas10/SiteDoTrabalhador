
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores do Gov.br - Azul Institucional
        govblue: {
          50: '#ebf3ff',
          100: '#d1e4ff',
          200: '#aed0ff',
          300: '#7bb5ff',
          400: '#4690ff',
          500: '#1e5eff',
          600: '#1351B4', // Cor principal do gov.br
          700: '#0f3d85',
          800: '#133069',
          900: '#172b57',
        },
        // Verde Gov.br
        govgreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#168821', // Verde principal do gov.br
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Amarelo Gov.br
        govyellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#FFCD07', // Amarelo principal do gov.br
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Cinzas do Gov.br
        govgray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Manter as cores primárias como azul do gov
        primary: {
          50: '#ebf3ff',
          100: '#d1e4ff',
          200: '#aed0ff',
          300: '#7bb5ff',
          400: '#4690ff',
          500: '#1e5eff',
          600: '#1351B4',
          700: '#0f3d85',
          800: '#133069',
          900: '#172b57',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
