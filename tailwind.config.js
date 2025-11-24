/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/**/src/**/*.{html,js,svelte,ts}",
    "./src/**/*.{html,js,svelte,ts}", // optionally root shared code
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
