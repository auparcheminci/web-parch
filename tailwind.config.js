/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/**/src/**/*.{html,js,svelte,ts}", // apps
    "./styles/**/*.{css,scss}", // root shared styles folder (example)
    "./src/**/*.{html,js,svelte,ts}", // root-level src folder if exists
    "./*.{html,js,ts,svelte}", // root entry files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
