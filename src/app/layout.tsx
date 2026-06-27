import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap"
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap"
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://uniun.vercel.app";

const title = "UNIUN — Your decentralized second brain";

const description =
  "Capture notes, connect them into a knowledge graph, share on an open network, and ask an AI that runs on your phone — not in someone else's cloud. Decentralized, offline-first, on-device.";

const ogDescription =
  "A note-sharing network where ideas become feed, thread, graph, and AI context. Built for ownership, clarity, and knowledge.";

const ogImage = "/og-users.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: title,
    template: "%s | UNIUN",
  },

  description,

  applicationName: "UNIUN",

  keywords: [
    "UNIUN",
    "note sharing app",
    "note network",
    "second brain",
    "AI notes",
    "personal AI assistant",
    "knowledge graph",
    "offline first app",
    "open source notes",
    "decentralized notes",
    "team notes",
    "connected conversations",
  ],

  authors: [{ name: "Basic Tech" }],
  creator: "Basic Tech",
  publisher: "Basic Tech",

  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
        sizes: "64x64",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "UNIUN",
    title,
    description: ogDescription,
    images: [
      {
        url: ogImage,
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "UNIUN — Your notes, your network, and your AI.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description: ogDescription,
    images: [
      {
        url: ogImage,
        type: "image/jpeg",
      }
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`}>
        {children}
      </body>
    </html>
  );
}
