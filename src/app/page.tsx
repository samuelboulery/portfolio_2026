import { Desktop } from "@/components/os/Desktop";
import { Paragraph } from "@/components/typography/Paragraph";
import { Title } from "@/components/typography/Title";

export default function Home() {
  return (
    <Desktop>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-m)",
          maxWidth: "640px",
        }}
      >
        <Title as="h1" size="l">
          Portfolio 2026 — chantier en cours
        </Title>
        <Paragraph tone="muted">
          Chrome OS posé : barre système, dock flottant, scène desktop. Les fenêtres arrivent en
          phase 4.
        </Paragraph>
      </div>
    </Desktop>
  );
}
