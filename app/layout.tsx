import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Print Goals",
  description: "Simple goal tracking for printing",
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