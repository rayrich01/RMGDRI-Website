/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Use absolute paths to handle Vercel's "Include files outside root directory" setting
    `${__dirname}/src/**/*.{js,ts,jsx,tsx,mdx}`,
    `${__dirname}/components/**/*.{js,ts,jsx,tsx,mdx}`,
  ],
  safelist: [
    // Status badge colors (available-danes/page.tsx)
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-red-600',
    'bg-gray-500',
    // Compatibility badge colors (DogFacts.tsx)
    'bg-red-100',
    'text-red-800',
    'border-red-200',
    'bg-green-100',
    'text-green-800',
    'border-green-200',
    'bg-gray-100',
    'text-gray-600',
    'border-gray-200',
    // Dog detail status badge (available-danes/[slug]/page.tsx)
    'bg-teal-500',
    'border-teal-500',
    'bg-emerald-100',
    'text-emerald-800',
    'bg-gray-800',
    // Utah events featured styling
    'border-teal-500',
    'ring-2',
    'ring-teal-100',
    'border-gray-200',
  ],
  theme: {
    extend: {
      // RMGDRI Brand Colors - Extract exact values from Readdy prototype
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Main brand color - adjust based on Readdy
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        // Great Dane themed accent colors
        dane: {
          black: '#1a1a1a',
          blue: '#4a6fa5',
          fawn: '#c9a959',
          brindle: '#8b6914',
          harlequin: '#f5f5f5',
          mantle: '#2d3436',
        },
        // Status colors for dog availability
        status: {
          available: '#22c55e',
          pending: '#f59e0b',
          adopted: '#3b82f6',
          foster: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Custom sizes for impact statistics
        stat: ['4rem', { lineHeight: '1', fontWeight: '700' }],
        'stat-sm': ['2.5rem', { lineHeight: '1', fontWeight: '700' }],
      },
      spacing: {
        // Match Readdy spacing if known
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'count-up': 'countUp 2s ease-out',
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
        countUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
      },
    },
  },
  plugins: [],
};
