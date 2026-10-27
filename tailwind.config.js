/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: '#F8F9FA',
        surface: '#FFFFFF',
        'surface-subtle': '#F1F3F5',
        'border-subtle': '#E9ECEF',
        'accent-primary': '#FF5A36',
        'accent-hover': '#E04826',
        'accent-surface': '#FFF0EB',
        'brand-whatsapp': '#16A34A',
        'status-open': '#16A34A',
        'status-closed': '#DC2626',
        'text-main': '#18181B',
        'text-muted': '#71717A',
        'text-caption': '#A1A1AA',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}