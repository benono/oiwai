import lineClamp from "@tailwindcss/line-clamp";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-primary/20",
    "bg-accentGreen/20",
    "bg-accentBlue/20",
    "bg-accentPurple/20",
    "text-primary",
    "text-accentGreen",
    "text-accentBlue",
    "text-accentPurple",
  ],
  theme: {
    extend: {
      borderWidth: {
        "0.2": "0.2px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        text: "hsl(60, 2%, 25%, 100%)",
        textSub: "hsl(60, 1%, 62%, 100%)",
        textBorder: "hsl(60, 7%, 82%, 100%)",
        textBorderLight: "hsl(60, 9%, 96%, 100%)",
        accentGreen: "hsl(172, 73%, 34%, 100%)",
        accentGreenLight: "hsl(172, 73%, 34%, 70%)",
        accentBlue: "hsl(200, 72%, 37%, 100%)",
        accentPurple: "hsl(284, 29%, 44%, 100%)",
        accentPink: "hsl(340, 71%, 58%, 100%)",
        error: "hsl(0, 84%, 60%, 100%)",
        warning: "hsl(25, 95%, 53%, 100%)",
        backgroundSub: "#F4E5C6",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        l3: {
          "20%": { backgroundPosition: "0%   0%, 50%  50%,100%  50%" },
          "40%": { backgroundPosition: "0% 100%, 50%   0%,100%  50%" },
          "60%": { backgroundPosition: "0%  50%, 50% 100%,100%   0%" },
          "80%": { backgroundPosition: "0%  50%, 50%  50%,100% 100%" },
        },
        spinner: {
          "0%, 100%": {
            boxShadow:
              "0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0",
          },
          "12.5%": {
            boxShadow:
              "0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em",
          },
          "25%": {
            boxShadow:
              "0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em",
          },
          "37.5%": {
            boxShadow:
              "0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em",
          },
          "50%": {
            boxShadow:
              "0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em",
          },
          "62.5%": {
            boxShadow:
              "0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em",
          },
          "75%": {
            boxShadow:
              "0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0",
          },
          "87.5%": {
            boxShadow:
              "0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        l3: "l3 1s infinite linear",
        spinner: "spinner 1.3s infinite linear",
      },
    },
  },
  plugins: [tailwindcssAnimate, lineClamp],
} satisfies Config;
