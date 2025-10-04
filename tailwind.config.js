/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'lg-custom': '1260px',
        'md-custom': '1168px',
        'xs': '390px'
      }
    },
  },
  plugins: [],
};
