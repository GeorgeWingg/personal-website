import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// app/icon.png and app/apple-icon.png are served automatically by Next's
// metadata file conventions, so no manual icons entry is needed here
export const metadata: Metadata = {
  title: "George Wing",
  description: "Building AI agents, goal trees, and thinking about the future",
  openGraph: {
    title: "George Wing",
    description: "Building AI agents, goal trees, and thinking about the future",
    type: "website",
    images: ["/profile-avatar-hd.jpg"],
  },
  twitter: {
    card: "summary",
    title: "George Wing",
    description: "Building AI agents, goal trees, and thinking about the future",
    images: ["/profile-avatar-hd.jpg"],
    creator: "@george__wing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${jetbrainsMono.variable} font-jetbrains antialiased bg-game-black text-white`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}