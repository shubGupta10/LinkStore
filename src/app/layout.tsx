import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppWrapper } from "@/context";
import Navbar from '@/components/Navbar'
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Link Store",
  description: "Store all your links at one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWrapper>
          <Navbar/>
        {children}
        <Toaster/>
        </AppWrapper>
      </body>
    </html>
  );
}
