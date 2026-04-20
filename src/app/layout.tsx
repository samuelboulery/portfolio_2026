import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samuel Boulery — System Designer",
  description:
    "Portfolio de Samuel Boulery, System Designer & Token Architect. Études de cas EDF, Mazars, Bonum, Greenweez.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
