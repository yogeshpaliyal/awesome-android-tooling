// tailwind.config.js
import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html', './index.html'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3DDC84", // Android green
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Define pastel colors directly to work with bg-card-pastel-* classes
        "card-pastel-green": '#F0FFF4', // Very light green
        "card-pastel-blue": '#EFF6FF', // Very light blue
        "card-pastel-yellow": '#FFFBEB', // Very light yellow
        "card-pastel-purple": '#FAF5FF', // Very light purple
        "card-pastel-red": '#FEF2F2', // Very light red
        "card-pastel-indigo": '#EEF2FF', // Very light indigo
        "card-pastel-cyan": '#ECFEFF', // Very light cyan
        "card-pastel-teal": '#F0FDFA', // Very light teal
        "card-pastel-lime": '#F7FEE7', // Very light lime
        "card-pastel-orange": '#FFF7ED', // Very light orange
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;