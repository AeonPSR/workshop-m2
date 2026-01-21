import type { Metadata } from "next";
import "./globals.css";
import { DemoModeProvider } from "@/context/DemoModeContext";

export const metadata: Metadata = {
  title: "Next.js + SQLite + Zod",
  description: "A Next.js application with SQLite database and Zod validation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DemoModeProvider>
          {children}
        </DemoModeProvider>
      </body>
    </html>
  );
}
