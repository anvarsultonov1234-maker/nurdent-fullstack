import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: "#ffffff",
          surface: "#f5f5f7",
          surfaceHover: "#ebebee",
          text: "#1d1d1f",
          subtext: "#86868b",
          blue: "#0071e3",
          blueHover: "#0077ed",
          border: "rgba(0, 0, 0, 0.08)",
          borderLight: "rgba(0, 0, 0, 0.04)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
