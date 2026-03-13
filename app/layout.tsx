import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Borongan E-Services — City of Borongan Digital Services",
  description: "Your digital gateway to City of Borongan, Eastern Samar government services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-bg-base antialiased">
        {children}
      </body>
    </html>
  );
}
