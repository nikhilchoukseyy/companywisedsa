export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        page: '#1a1a1a',
        surface: '#262626',
        'surface-raised': '#2d2d2d',
        border: {
          DEFAULT: '#3a3a3a',
          strong: '#474747',
        },
        text: {
          primary: '#e8e8e8',
          secondary: '#9a9a9a',
          muted: '#6d6d6d',
        },
        brand: {
          DEFAULT: '#ffa116',
          light: '#ffc857',
        },
        easy: '#2cbb5d',
        medium: '#ffb800',
        hard: '#ef4743',
      },
    },
  },
  plugins: [],
};
