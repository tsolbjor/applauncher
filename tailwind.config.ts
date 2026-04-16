import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 24px 70px rgba(43, 37, 31, 0.08)",
      },
      backgroundImage: {
        paper: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.55), transparent 32%), radial-gradient(circle at 80% 0%, rgba(219, 205, 189, 0.32), transparent 28%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
