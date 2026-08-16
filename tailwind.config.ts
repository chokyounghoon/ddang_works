import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 땡겨요 공식 시그니처 레드 (핵심 액션 및 포인트)
        primary: {
          DEFAULT: "#FB521C",
          hover: "#E04514",
          light: "#FFF2EE",
        },
        // 신뢰감 있는 신한 딥 네이비 (텍스트 및 다크모드 베이스)
        navy: {
          DEFAULT: "#0F172A",
          dark: "#0B132B",
        },
        // 깔끔한 라이트 배경 및 서피스
        appBg: {
          light: "#F8FAFC",
          dark: "#0F172A",
        },
        cardBg: {
          light: "#FFFFFF",
          dark: "rgba(30, 41, 59, 0.7)",
        }
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      }
    },
  },
  plugins: [],
};

export default config;
