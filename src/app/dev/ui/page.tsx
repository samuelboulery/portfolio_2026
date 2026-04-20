/**
 * Page de prévisualisation des primitives UI — route dev, supprimée avant prod.
 */
import { ArrowRight, Download } from "lucide-react";
import { Paragraph } from "@/components/typography/Paragraph";
import { Title } from "@/components/typography/Title";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import styles from "./page.module.css";

export default function DevUIPage() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Title</h2>
        <div className={styles.stack}>
          <Title as="h1" size="xl">
            Title XL — 64px
          </Title>
          <Title as="h2" size="l">
            Title L — 40px
          </Title>
          <Title as="h3" size="m">
            Title M — 32px
          </Title>
          <Title as="h4" size="s">
            Title S — 24px
          </Title>
          <Title as="h4" size="s" muted>
            Title S muted
          </Title>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Paragraph</h2>
        <div className={styles.stack}>
          <Paragraph size="l">Paragraph L — 24px, ligne de lecture généreuse.</Paragraph>
          <Paragraph size="m">Paragraph M — 16px, taille de corps standard.</Paragraph>
          <Paragraph size="s">Paragraph S — 14px, meta / captions.</Paragraph>
          <Paragraph size="m" tone="muted">
            Paragraph muted — utilisé pour descriptions secondaires.
          </Paragraph>
          <Paragraph size="s" tone="decorative">
            Paragraph decorative — ornemental, contraste réduit.
          </Paragraph>
          <Paragraph size="m" mono>
            Paragraph mono — Chivo Mono pour contextes terminal / données.
          </Paragraph>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tag</h2>
        <div className={styles.row}>
          <Tag>Design System</Tag>
          <Tag>Tokens</Tag>
          <Tag>React 19</Tag>
          <Tag>Next.js 16</Tag>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Button</h2>
        <div className={styles.row}>
          <Button variant="outlined">En savoir plus</Button>
          <Button variant="plain">Me contacter</Button>
          <Button variant="outlined" size="s">
            Petit
          </Button>
          <Button variant="plain" size="s">
            Petit plein
          </Button>
        </div>
        <div className={styles.row}>
          <Button variant="outlined" icon={<Download size={16} />}>
            Télécharger
          </Button>
          <Button variant="plain" icon={<ArrowRight size={16} />} iconPosition="right">
            Suivant
          </Button>
          <Button variant="outlined" disabled>
            Désactivé
          </Button>
        </div>
      </section>
    </main>
  );
}
