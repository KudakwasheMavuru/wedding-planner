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
        sage: {
          hint: "#B7CFB5",
          light: "#A2B5A2",
          DEFAULT: "#9BAA7F",
          medium: "#9AA796",
          dark: "#606C46",
          moss: "#405335",
          evergreen: "#344C3D",
        },
        cream: "#FAF8F4",
        parchment: "#F5F0E8",
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
