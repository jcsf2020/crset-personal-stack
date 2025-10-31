import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./node_modules/@/components/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Oxanium", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      colors: {
        neon: {
          50: "#e9fff8",
          100: "#c7ffee",
          200: "#8bffd9",
          300: "#4cffc2",
          400: "#1fffb1",
          500: "#00e8a0",
          600: "#00bf84",
          700: "#009569",
          800: "#066e52",
          900: "#084f3b",
        },
        cyber: {
          400: "#6ee7ff",
          500: "#22d3ee",
          600: "#06b6d4",
        },
      },
      backgroundImage: {
        grid: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.1) 1px, transparent 0)`,
        gridDark: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.05) 1px, transparent 0)`,
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      boxShadow: {
        neon: "0 0 24px 0 rgba(34, 211, 238, 0.35)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glow: {
          "0%, 100%": { filter: "drop-shadow(0 0 0px #22d3ee)" },
          "50%": { filter: "drop-shadow(0 0 6px #22d3ee)" },
        },
      },
      animation: {
        scan: "scan 4s linear infinite",
        glow: "glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
