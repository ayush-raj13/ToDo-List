/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        'inter-tight': ['Inter Tight', 'sans-serif'],

        'kulim-park': ['Kulim Park', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
