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
        // 신뢰감 있는 딥 네이비 배경 (다크모드용)
        background: {
          DEFAULT: "#F8FAFC",
          dark: "#0F172A",
          light: "#F8FAFC",
        },
        // 메인 포인트 컬러: 땡겨요 시그니처 오렌지 & 신한 신뢰의 블루
        primary: {
          DEFAULT: "#FB521C",
          hover: "#E04514",
          light: "#FFF2EE",
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
        },
        // 카드 및 유리 효과 배경 (Glassmorphism용)
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.9)",
          dark: "rgba(30, 41, 59, 0.7)",
          light: "rgba(255, 255, 255, 0.9)",
        },
        // 신한 딥 네이비
        navy: {
          DEFAULT: "#0F172A",
          dark: "#0B132B",
        },
      },
      fontFamily: {
        // 모바일 표준: 프리텐다드 (가독성 끝판왕)
        sans: ["Pretendard Variable", "Pretendard", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
        card: "0 4px 16px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
