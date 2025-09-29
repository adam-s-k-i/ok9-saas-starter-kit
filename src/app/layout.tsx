import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OK9 SaaS Starter Kit - Modern SaaS Development Platform",
    template: "%s | OK9 SaaS Starter Kit"
  },
  description: "Modular SaaS Starter Kit with Next.js, TypeScript, TailwindCSS, and modern web technologies. Build scalable SaaS applications faster.",
  keywords: ["SaaS", "Next.js", "TypeScript", "TailwindCSS", "Stripe", "Authentication", "Dashboard"],
  authors: [{ name: "OK9 Team" }],
  creator: "OK9",
  publisher: "OK9",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://ok9-saas.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: '/',
    title: 'OK9 SaaS Starter Kit - Modern SaaS Development Platform',
    description: 'Modular SaaS Starter Kit with Next.js, TypeScript, TailwindCSS, and modern web technologies.',
    siteName: 'OK9 SaaS Starter Kit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OK9 SaaS Starter Kit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OK9 SaaS Starter Kit - Modern SaaS Development Platform',
    description: 'Modular SaaS Starter Kit with Next.js, TypeScript, TailwindCSS, and modern web technologies.',
    images: ['/og-image.png'],
    creator: '@ok9saas',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}