import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptFácil — Convierte tus ideas en prompts profesionales",
  description:
    "Transformá cualquier deseo simple en un prompt estructurado y profesional para ChatGPT, Claude, Gemini o Midjourney. Gratis, rápido y sin registro.",
  keywords: ["prompt engineering", "ChatGPT", "Claude", "Gemini", "Midjourney", "IA", "prompt generator"],
  openGraph: {
    title: "PromptFácil",
    description: "Convierte tus ideas en prompts profesionales para IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
