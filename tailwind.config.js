module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        'layout': 'auto 1fr',
        'layout-2': 'repeat(1fr, 8)',
      }
    },
  },
  plugins: [],
}
