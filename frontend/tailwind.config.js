/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          main: 'var(--bg-main)',
          surface: 'var(--bg-surface)',
          subtle: 'var(--bg-subtle)',
          card: 'var(--bg-card)',
          border: 'var(--border-main)',
          'border-subtle': 'var(--border-subtle)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        }
      }
    },
  },
  plugins: [],
}
