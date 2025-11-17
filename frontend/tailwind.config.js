import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn:{
          "0%": {opacity:"0"},
          "100%": {opacity:"1"}
        },
        fadeOut:{
          "0%": {opacity:"1"},
          "100%": {opacity:"0"}
        },
        scaleIn: {
          "0%": {opacity:"0", transform:"scale(0.8)"},
          "100%": {opacity:"1",transform:"scale(1)"}
        },
        scaleOut: {
          "0%": {opacity: "1" ,transform:"scale(1)"},
          "100%": {opacity: "0", transform:"scale(0.8)"}
        },
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out forwards",
        fadeOut: "fadeOut 0.25s ease-in forwards",
        scaleIn: "scaleIn 0.25s ease-out forwars",
        scaleOut: "scaleOut 0.25s ease-in forwards"
      },

      fontFamily: {
        poppins: ['Poppins', "sans-serif"]
      }
    },
  },
  plugins: [],
}

