import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  themeColor: "#050514",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark select-none`}
    >
      <body className="min-h-full flex flex-col bg-[#03030d] text-slate-100 overflow-x-hidden touch-manipulation">
        {children}
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=6fdbed77a229d105034026990013707b&libraries=services,clusterer&autoload=false`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
