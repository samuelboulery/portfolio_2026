/**
 * Page d'accueil — placeholder Phase 1.
 *
 * Objectif unique : valider que la chaîne de tokens se propage jusqu'au rendu.
 * Sera remplacée en Phase 3+ par la scène OS (Desktop + OSBar + Dock + fenêtres).
 */
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "var(--space-xl)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-m)",
          maxWidth: "560px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "var(--fs-title-l)",
            lineHeight: "var(--lh-title-l)",
            color: "var(--text-primary)",
          }}
        >
          Portfolio 2026 — chantier en cours
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body-m)",
            lineHeight: "var(--lh-body-m)",
            color: "var(--text-muted)",
          }}
        >
          Design system initialisé. Les prochaines phases installent la scène OS (OS bar, dock,
          fenêtres draggables, terminal, études de cas).
        </p>
      </div>
    </main>
  );
}
