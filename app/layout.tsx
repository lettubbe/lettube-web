import type { Metadata } from "next";
import { Geist, Geist_Mono, Carter_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const carterOne = Carter_One({
  variable: "--font-carter-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Lettubbe",
  description: "Built for creators. Ruled by viewers.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${carterOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
