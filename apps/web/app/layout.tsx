import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lugha",
  description: "Lugha language learning platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
