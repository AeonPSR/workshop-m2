import type { Metadata } from "next";
import "./globals.css";
import { DemoModeProvider } from "@/context/DemoModeContext";

export const metadata: Metadata = {
  title: "Scoutify",
  description: "Scoutify - Générateur de CV pour joueurs de football",
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
