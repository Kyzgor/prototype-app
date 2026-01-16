import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Typography System
 *
 * Display: Cinzel - Ancient Roman inscriptions, powerful & mystical
 * Body: Cormorant Garamond - Elegant, dramatic, readable
 * Mono: Geist Mono - Clean monospace for technical elements
 */

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARG Platform Prototype",
  description: "Prototype for ARG platform launch flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
