import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PollProvider } from "@/context/PollContext";
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
  title: "Stellar Yellow Belt — Live Poll",
  description:
    "A Soroban Live Poll dApp for the Stellar Journey to Mastery Challenge (Yellow Belt).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <PollProvider>{children}</PollProvider>
      </body>
    </html>
  );
}
