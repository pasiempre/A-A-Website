/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1628",
          light: "#162742",
          overlay: "#081120",
        },
        gold: {
          DEFAULT: "#C9A94E",
          hover: "#d4b85e",
          muted: "#8a6a1c",
        },
        royal: {
          DEFAULT: "#2563EB",
          bright: "#1D4ED8",
          "bright-hover": "#1948ca",
        },
        warm: {
          DEFAULT: "#FAFAF8",
          panel: "#F1F0EE",
        },
        "dark-panel": "#1a2a44",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        micro: ["10px", { lineHeight: "1.4", letterSpacing: "0.22em" }],
        kicker: ["11px", { lineHeight: "1.4", letterSpacing: "0.18em" }],
      },
      letterSpacing: {
        kicker: "0.24em",
        wide: "0.18em",
        wider: "0.22em",
        label: "0.20em",
        chips: "0.16em",
      },
      borderRadius: {
        panel: "1.75rem",
        card: "1.5rem",
      },
      boxShadow: {
        "panel-soft": "0 8px 30px rgba(15,23,42,0.08)",
        "panel-dark": "0 24px 80px rgba(2,6,23,0.26)",
        "hero-glow": "0 18px 60px rgba(2,6,23,0.16)",
        "cta-blue": "0 18px 50px rgba(29,78,216,0.35)",
      },
      backgroundImage: {
        "dot-pattern": "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        "gold-radial": "radial-gradient(circle at top, rgba(201,169,78,0.14), transparent 34%)",
      },
      backgroundSize: {
        dots: "40px 40px",
        "dots-sm": "32px 32px",
        "dots-lg": "48px 48px",
      },
      animation: {
        "fade-up": "heroFadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "ken-burns": "heroKenBurns 15s ease-out forwards",
        "bounce-subtle": "heroBounceSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        heroFadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        heroKenBurns: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.05)" },
        },
        heroBounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
    },
  },
  plugins: [],
}

