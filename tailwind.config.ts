import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        abyss: "#05070c",
        graphite: "#10141f",
        glass: "rgba(16, 22, 34, 0.72)",
        ion: "#76f7d5",
        violet: "#9d7cff",
        ember: "#ffb86b",
        signal: "#8dfcf0"
      },
      boxShadow: {
        glow: "0 0 50px rgba(118, 247, 213, 0.18)",
        violet: "0 0 48px rgba(157, 124, 255, 0.2)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
