
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Question From My Heart 💍",
  description: "One question. Two hearts. A lifetime together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
