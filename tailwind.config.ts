import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "xs-plus": ["0.8125rem", { lineHeight: "1.25rem" }],
        "sm-plus": ["1rem", { lineHeight: "1.25rem" }],
      },
      backgroundImage: {
        "prode-dark":
          "radial-gradient(circle at top left, rgba(57,169,53,0.18), transparent 32%), linear-gradient(135deg, #06111F 0%, #0A1728 52%, #03101B 100%)",
        "prode-card":
          "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,248,251,0.98))",
      },
      boxShadow: {
        "prode-card": "0 14px 35px rgba(15, 23, 42, 0.08)",
        "prode-dark": "0 20px 45px rgba(0, 0, 0, 0.35)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      colors: {
        prode: {
          dark: "#06111F",
          darkSoft: "#0A1728",
          navy: "#101E2D",
          green: "#39A935",
          greenDark: "#247A28",
          gold: "#F7B731",
          light: "#F5F7FA",
          border: "#E5EAF0",
          text: "#172033",
          muted: "#6B7280",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        float: "float 2.2s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};

export default config;