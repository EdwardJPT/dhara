/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./web/templates/*.html", "./web/templates/**/*.html", "./web/src/**/*.{jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#1a6582",
                hover: "#2284aa",
            },
            fontFamily: {
                "sans": ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
            },
            letterSpacing: {
                title: "5px",
            },
        },
    },
    plugins: [],
};
