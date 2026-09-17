import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Poppins } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DevFlow",
  description: "AI-powered software development workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={poppins.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
