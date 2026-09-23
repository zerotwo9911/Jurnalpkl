import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JURNAL PKL",
  description: "Digital Journal System"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}