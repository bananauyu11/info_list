import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavShell from "@/components/NavShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PMO情報整理・交通整理アプリ",
  description: "会議・チャット・資料から得た情報を素早く記録し、後から整理するためのアプリ",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "情報整理",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <NavShell>{children}</NavShell>
      </body>
    </html>
  );
}
