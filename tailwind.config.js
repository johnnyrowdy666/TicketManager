/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',
    './public/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117',
        card: '#161b22',
        text: '#e6edf3',
        muted: '#8b949e',
        accent: '#2f81f7',
        accent2: '#3fb950',
      },
    },
  },
  corePlugins: { preflight: false },
};