const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: '#F9FAFB',
          text: '#111827',
          primary: '#3B82F6',
          inputBg: '#FFFFFF',
          buttonBg: '#3B82F6',
          buttonText: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          background: '#1F2937',
          text: '#D1D5DB',
          primary: '#3B82F6',
          inputBg: '#2D3748',
          buttonBg: '#3B82F6',
          buttonText: '#FFFFFF',
        },
      },
    },
  })]
}

