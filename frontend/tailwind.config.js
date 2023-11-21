/** @type {import('tailwindcss').Config} */

export const content = ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"];

export const theme = {
  fontFamily: {
    primary: ["Arial"],
  },
  extend: {
    fontSize: {
      "2xs": "0.687rem",
      sm: "0.8125rem",
    },
  },
};
