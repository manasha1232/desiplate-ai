/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgLight: "#F8F9FA",
        cardBg: "#FFFFFF",
        charcoal: "#1F2937",
        subtleGrey: "#6B7280",
        terracotta: "#E05D38",
        saffron: "#D97706",
        sage: "#10B981",
        sageLight: "#ECFDF5",
        accentBorder: "#E5E7EB"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
