/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eef6ff',
            100: '#d9eaff',
            200: '#bcd9ff',
            300: '#91c0ff',
            400: '#609dff',
            500: '#3b82f6', // Primary blue
            600: '#2463eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554',
          },
          secondary: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981', // Secondary green
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
          },
          accent: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6', // Accent purple
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
            950: '#2e1065',
          },
          dark: {
            DEFAULT: '#1F2937',
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
          },
        },
        fontFamily: {
          sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
          serif: ['var(--font-merriweather)', 'Merriweather', 'Georgia', 'serif'],
        },
        borderRadius: {
          '4xl': '2rem',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '112': '28rem',
          '128': '32rem',
        },
        boxShadow: {
          'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
          'button': '0 2px 6px rgba(0, 0, 0, 0.08)',
          'card': '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              color: theme('colors.dark.700'),
              a: {
                color: theme('colors.primary.500'),
                '&:hover': {
                  color: theme('colors.primary.600'),
                },
              },
              h1: { color: theme('colors.dark.900') },
              h2: { color: theme('colors.dark.900') },
              h3: { color: theme('colors.dark.900') },
              h4: { color: theme('colors.dark.900') },
              h5: { color: theme('colors.dark.900') },
              h6: { color: theme('colors.dark.900') },
            },
          },
          dark: {
            css: {
              color: theme('colors.dark.100'),
              a: {
                color: theme('colors.primary.400'),
                '&:hover': {
                  color: theme('colors.primary.300'),
                },
              },
              h1: { color: theme('colors.dark.50') },
              h2: { color: theme('colors.dark.50') },
              h3: { color: theme('colors.dark.50') },
              h4: { color: theme('colors.dark.50') },
              h5: { color: theme('colors.dark.50') },
              h6: { color: theme('colors.dark.50') },
            },
          },
        }),
        animation: {
          'fade-in': 'fade-in 0.5s ease-out',
          'slide-up': 'slide-up 0.5s ease-out',
          'slide-down': 'slide-down 0.5s ease-out',
          'bounce-slow': 'bounce 3s infinite',
        },
        keyframes: {
          'fade-in': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          'slide-up': {
            '0%': { transform: 'translateY(10px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
          'slide-down': {
            '0%': { transform: 'translateY(-10px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
    ],
  };