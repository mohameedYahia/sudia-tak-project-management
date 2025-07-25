/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/*.js"],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Tajawal', 'Cairo', 'Amiri', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce5cd',
          300: '#8dd1ab',
          400: '#5ab682',
          500: '#4A5C52',
          600: '#3a4a42',
          700: '#2f3b35',
          800: '#26302b',
          900: '#1f2824',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  }
}
