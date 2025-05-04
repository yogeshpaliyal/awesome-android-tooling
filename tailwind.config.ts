// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend:
      {
        colors:
        {
          'bg-android-green': '#EDC7B7',
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }