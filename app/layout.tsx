import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Split Money Pro | Smart Bill Splitting App",
    template: "%s | Split Money Pro",
  },
  description:
    "Smart group expense splitting app. Easily track shared bills, calculate who owes whom, and settle payments quickly. Website chia tiền nhóm bạn thông minh, minh bạch và nhanh chóng.",
  keywords: [
    "split bill",
    "bill splitter",
    "group expense tracker",
    "shared expenses",
    "who owes who",
    "trip expense calculator",
    "chia tiền",
    "chia bill nhóm",
    "quản lý chi tiêu nhóm",
    "split money",
  ],
  authors: [{ name: "Split Money Pro" }],
  creator: "Split Money Pro",
  publisher: "Split Money Pro",
  metadataBase: new URL("https://splitmoneypro.vercel.app/"),

  openGraph: {
    title: "Split Money Pro | Smart Bill Splitting App",
    description:
      "Create a group, add expenses, and automatically calculate who should pay whom. Tạo nhóm, nhập khoản chi và tự động tính toán chia tiền.",
    url: "https://splitmoneypro.vercel.app/",
    siteName: "Split Money Pro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Split Money Pro",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Split Money Pro | Smart Bill Splitting App",
    description: "Track group expenses and split bills fairly in seconds.",
    images: ["/logo.png"],
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/context/i18n-context";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {modal}
            <Toaster position="top-center" richColors />
            <Analytics />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
