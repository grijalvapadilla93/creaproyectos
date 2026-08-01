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
        // Brand palette — CREA PROYECTOS
        teal: {
          DEFAULT: "#3C6E80",
          deep: "#2E5866",
          ink: "#1F3D47",
        },
        verde: {
          DEFAULT: "#5C7A5E",
          deep: "#46604A",
        },
        arena: {
          DEFAULT: "#C9B896",
          soft: "#E4D9C3",
        },
        crema: "#F7F6F2",
        carbon: "#141414",
        night: "#0F1B1E", // deep teal-black for dark sections
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
