/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    fontFamily: {
      roboto: ["Roboto" ,"sans-serif"],
      robotobold: ["Roboto-Bold" ,"sans-serif"],
      robotolight: ["Roboto-Light" ,"sans-serif"],
      robotomedium: ["Roboto-Medium" ,"sans-serif"],
    },
  },
  plugins: [],
}

