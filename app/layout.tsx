import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptSuperhero — Customer Support Reply Generator",
  description:
    "Generate professional customer support replies (refunds, shipping delays, angry customers) in seconds. 3 free replies, then subscribe.",
  keywords: [
    "customer support reply generator",
    "refund response",
    "shipping delay apology",
    "de-escalation",
    "ecommerce support",
  ],
  openGraph: {
    title: "PromptSuperhero",
    description: "Generate professional customer support replies in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
