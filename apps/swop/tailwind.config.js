// tailwind config is required for editor support

const sharedConfig = require("tailwind-config/tailwind.config.js");

module.exports = {
  presets: [sharedConfig],
  theme: {
    // extend: {},
    extend: {
      animation: {
        moveUpDown: 'moveUpDown 10s ease-in-out infinite', // Adjust the duration as needed
      },
      keyframes: {
        moveUpDown: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-115px)', // Adjust the distance the image moves up
          }
        }
      }
    },
  },
};