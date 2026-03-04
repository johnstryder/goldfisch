/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#1e293b',
        secondary: '#1e293b',
        text: '#f8fafc',
        muted: '#94a3b8',
        primary: {
          DEFAULT: '#d4af37',
          foreground: '#0f172a',
        },
        danger: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
        glass: 'rgba(255, 255, 255, 0.1)',
        'tier-premier': '#fbbf24',
        'tier-core': '#60a5fa',
        'tier-drainy': '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '999px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        glow: '0 0 15px rgba(212, 175, 55, 0.5)',
      },
      spacing: {
        xs: '4px',
      },
      accentColor: {
        primary: '#d4af37',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
