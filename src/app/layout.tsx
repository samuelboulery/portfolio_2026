import type { Metadata } from "next";
import { Dock } from "@/components/os/Dock";
import { OSBar } from "@/components/os/OSBar";
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
      <body>
        <OSBar />
        {children}
        <Dock />
      </body>
    </html>
  );
}
