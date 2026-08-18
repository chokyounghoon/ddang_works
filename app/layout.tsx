import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "땡겨요 웍스 (DDANG WORKS) - 모바일 AI 긱워크 플랫폼",
  description: "신한 7대 계열사 독점 연동 0.1초 퇴근 정산 & AI 긱 렌즈",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "땡겨요 WORKS",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FF5517",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} h-full antialiased dark select-none`}
      suppressHydrationWarning
    >
      <body
        className="h-full min-h-full flex flex-col bg-[#060713] text-slate-100 overflow-hidden touch-manipulation font-sans"
        suppressHydrationWarning
      >
        {children}
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=6fdbed77a229d105034026990013707b&libraries=services,clusterer&autoload=false`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
