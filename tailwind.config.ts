import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36aef8',
          500: '#0c93e7',
          600: '#0275c7',
          700: '#035da2',
          800: '#074f85',
          900: '#0c426e',
          950: '#082a49',
        },
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          active: '#334155',
          text: '#94a3b8',
          textActive: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
