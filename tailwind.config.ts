import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        /** Alias = template VeilleMarché (#1A4F8B / #EFF6FF) pour les écrans hors CSS du template */
        arch: {
          violet: "#1A4F8B",
          "violet-dark": "#0f3360",
          lavender: "#EFF6FF",
        },
        primary: "#1A4F8B",
        "primary-dark": "#0f3360",
        "primary-light": "#2563EB",
        green: "#16A34A",
        amber: "#D97706",
        teal: "#0D7490",
        red: "#DC2626",
        muted: "#64748B",
        border: "#E2E8F0",
        bg: "#F8FAFC",
      },
      fontFamily: {
        sans: ["Manrope", "san-serif"],
      },
      boxShadow: {
        card: "0 6px 24px rgba(26, 79, 139, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
