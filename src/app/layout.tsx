import type { Metadata } from "next";
import { DockBridge } from "@/components/os/DockBridge";
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
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Script synchrone anti-FOUC : applique le thème stocké avant le premier paint.
            Le contenu est du code statique — pas de risque XSS. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: script anti-FOUC statique, contenu non dynamique
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='retro')document.documentElement.dataset.theme='retro';}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <OSBar />
        {children}
        <DockBridge />
      </body>
    </html>
  );
}
