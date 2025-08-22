/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #10b981, 0 0 10px #10b981, 0 0 15px #10b981' },
          '100%': { boxShadow: '0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981' }
        }
      }
    },
  },
  plugins: [],
}