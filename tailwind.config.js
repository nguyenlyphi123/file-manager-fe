/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        popup: {
          '100%': { transform: 'scale(1)' },
          '0%': { transform: 'scale(0.7)' },
        },
        medium_card_dropdown: {
          '100%': { transform: 'translateY(16px) translateX(-10px)' },
          '0%': {
            transform: 'translateY(-20px) translateX(-10px)',
          },
        },
        large_card_dropdown: {
          '100%': { transform: 'translateY(24px) translateX(-18px)' },
          '0%': {
            transform: 'translateY(-20px) translateX(-18px)',
          },
        },
      },
      animation: {
        popup: 'popup .2s ease-in-out',
        medium_card_dropdown: 'medium_card_dropdown .2s ease-in-out',
        large_card_dropdown: 'large_card_dropdown .2s ease-in-out',
      },
      boxShadow: {
        perfect: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
        // rest of the box shadow values
      },
    },
  },
  plugins: [],
};
