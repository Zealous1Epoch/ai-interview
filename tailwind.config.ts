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
        background: "var(--bg)",
        foreground: "var(--fg)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        muted: "var(--fg-muted)",
        "muted-light": "var(--fg-light)",
        border: "var(--border)",
        "border-light": "var(--border-light)",
      },
      borderRadius: {
        pill: "var(--radius-pill)",
        card: "var(--radius-card)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
