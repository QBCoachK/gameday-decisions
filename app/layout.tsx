import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Day Decisions",
  description: "CFB go-for-2 and clock management assistant",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Game Day" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
