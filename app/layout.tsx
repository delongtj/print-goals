import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://print-goals.netlify.app'),
  title: "Print Goals",
  description: "Simple goal tracking for printing",
  openGraph: {
    title: "Print Goals",
    description: "Keep your goals in sight",
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Print Goals — Keep your goals in sight',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Print Goals",
    description: "Keep your goals in sight",
    images: ['/og.png'],
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
