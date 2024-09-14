module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        DEFAULT: '#ffffff', 
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}