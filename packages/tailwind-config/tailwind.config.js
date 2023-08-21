/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    // app content
    `app/**/*.{js,ts,jsx,tsx}`,
    // include packages if not transpiling
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["night", 'bumblebee'],
  }
};