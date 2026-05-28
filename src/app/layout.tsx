import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNIUN - Your notes. Your network. Your AI.",
  description:
    "A cinematic product experience for UNIUN, an offline-first distributed note network.",
  icons: {
    icon: "/assets/uniun_logo.png",
    apple: "/assets/uniun_logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
