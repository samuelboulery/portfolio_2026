export interface CVItem {
  period: string;
  title: string;
  subtitle?: string;
  href?: string;
  subtitleHref?: string;
}

export interface CVSection {
  id: string;
  title: string;
  items: readonly CVItem[];
}

export const CV_DOWNLOAD_HREF = "/cv.pdf";

export const CV_SECTIONS: readonly CVSection[] = [
  {
    id: "experiences",
    title: "Expériences",
    items: [
      {
        period: "Depuis 2024",
        title: "System Designer & Token Architect",
        subtitle: "EDF pour CBTW – CDI (chez CBTW)",
        href: "/projects/edf",
      },
      {
        period: "Depuis 2020",
        title: "UX/UI Designer & Formateur",
        subtitle: "Freelance",
      },
      {
        period: "2021 – 2024",
        title: "Batch Manager & Formateur",
        subtitle: "Le Wagon – Freelance",
        subtitleHref: "https://www.lewagon.com",
      },
      {
        period: "2022",
        title: "Design System Manager & UX/UI Designer",
        subtitle: "Greenweez – Freelance",
        href: "/projects/greenweez",
      },
      {
        period: "2020",
        title: "UI designer & UX Engineer",
        subtitle: "Un jour au château – Freelance",
      },
    ],
  },
  {
    id: "volunteering",
    title: "Bénévolat",
    items: [
      {
        period: "Depuis 2025",
        title: "Co-créateur et Community Lead",
        subtitle: "The Design Society",
      },
      {
        period: "Depuis 2025",
        title: "Leader",
        subtitle: "Friends of Figma Lyon",
        subtitleHref: "https://friends.figma.com/lyon",
      },
    ],
  },
  {
    id: "education",
    title: "Formations",
    items: [
      {
        period: "2020",
        title: "Concepteur d’application web FullStack",
        subtitle: "Le Wagon – Lyon",
        subtitleHref: "https://www.lewagon.com",
      },
      {
        period: "2019",
        title: "Certification de Langue anglaise (B1-B2)",
        subtitle: "Glasgow School of English – Écosse",
      },
      {
        period: "2016 – 2018",
        title: "BTS Design Graphique option communication et média numériques",
        subtitle: "École Supérieur de Design – Villefontaine",
      },
      {
        period: "2013 – 2016",
        title: "Baccalauréat Professionnel Communication visuelle plurimédia",
        subtitle: "Lycée du Premier Film – Lyon",
      },
    ],
  },
  {
    id: "languages",
    title: "Langues",
    items: [
      { period: "Français", title: "Natif" },
      { period: "Anglais", title: "B1 - B2" },
    ],
  },
];
