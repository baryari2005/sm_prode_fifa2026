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
          "radial-gradient(circle at top left, rgba(117,215,255,0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(246,200,95,0.1), transparent 26%), linear-gradient(135deg, #041427 0%, #082A4A 52%, #061B33 100%)",
        "prode-card":
          "linear-gradient(180deg, rgba(11,39,69,0.92), rgba(6,27,51,0.9))",
      },
      boxShadow: {
        "prode-card": "0 18px 52px rgba(0, 0, 0, 0.24)",
        "prode-dark": "0 26px 70px rgba(0, 0, 0, 0.34)",
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
          dark: "#041427",
          darkSoft: "#061B33",
          navy: "#0B2745",
          sky: "#75D7FF",
          skySoft: "#AEEBFF",
          gold: "#F6C85F",
          light: "#0E223A",
          border: "rgba(174,235,255,0.24)",
          text: "#FFFFFF",
          muted: "rgba(255,255,255,0.7)",
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
