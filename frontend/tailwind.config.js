/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#2563eb",
        "brand-dark": "#0f172a",
        "app-bg": "#eef1f5",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)",
        modal: "0 35px 90px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};
