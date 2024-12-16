/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {},
        /* ===== Fonts ===== */
        fontFamily: {
            roboto: ["Roboto", "sans-serif"],
            robotobold: ["Roboto-Bold", "sans-serif"],
            robotolight: ["Roboto-Light", "sans-serif"],
            robotomedium: ["Roboto-Medium", "sans-serif"],
        },

        /* ===== Colors ===== */
        colors: {
            primary_green: "#C3FF00",
            secondary_black: "#333",
            color_red_error: "#E81123",
            color_green_success: "#00A300",
            color__lightGray: "#818181",
            color_lightGray: "#D9D9D9",
        },

        /* ===== Container Responsivel ===== */
        container: {
            center: true, // Adiciona margin-left e margin-right automáticas
            padding: "1rem", // Adiciona padding interno (right e left)
        },
    },
    plugins: [],
};
