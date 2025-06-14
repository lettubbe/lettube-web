import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Lettubbe - Your Voice, Your Vibe, Your Space",
  description: "Built for creators. Ruled by viewers. A safe space to talk & create, share dreams and build inspiring communities. Download the beta app now.",
  keywords: ["streaming app", "content creation", "community", "creators", "viewers", "social media", "video platform", "creative space"],
  authors: [{ name: "Lettubbe Team" }],
  creator: "Lettubbe",
  publisher: "Lettubbe",
  category: "Entertainment",
  openGraph: {
    title: "Lettubbe - Your Voice, Your Vibe, Your Space",
    description: "Built for creators. Ruled by viewers. A safe space to talk & create, share dreams and build inspiring communities.",
    url: "https://lettubbe.online",
    siteName: "Lettubbe",
    images: [
      {
        url: "https://lettubbe.online/images/mockUp1.png",
        width: 1200,
        height: 800,
        alt: "Lettubbe app mockup",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lettubbe - Your Voice, Your Vibe, Your Space",
    description: "Built for creators. Ruled by viewers. A safe space to talk & create, share dreams and build inspiring communities.",
    images: ["https://lettubbe.online/images/mockUp1.png"],
    creator: "@lettubbe",
    site: "@lettubbe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code--here",
  },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Lettubbe",
    "applicationCategory": "SocialNetworkingApplication",
    "description": "Built for creators. Ruled by viewers. A safe space to talk & create, share dreams and build inspiring communities.",
    "url": "https://lettubbe.online",
    "downloadUrl": "https://lettube-apks.s3.eu-north-1.amazonaws.com/lettube-v1-production-13-06-2025.apk",
    "operatingSystem": "Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Lettubbe Team"
    },
    "image": "https://lettubbe.online/images/mockUp1.png",
    "screenshot": [
      "https://lettubbe.online/images/mockUp1.png",
      "https://lettubbe.online/images/mockUp2.svg",
      "https://lettubbe.online/images/mockUp3.png",
      "https://lettubbe.online/images/mockUp4.svg"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Carter+One&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
