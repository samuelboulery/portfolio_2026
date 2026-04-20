export interface CVItem {
  period: string;
  title: string;
  subtitle?: string;
  href?: string;
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
        period: "2023 — Aujourd'hui",
        title: "System Designer & Token Architect",
        subtitle: "EDF · CBTW",
      },
      {
        period: "2021 — 2023",
        title: "Senior Product Designer",
        subtitle: "Bonum",
      },
      {
        period: "2019 — 2021",
        title: "Product Designer",
        subtitle: "Greenweez",
      },
      {
        period: "2017 — 2019",
        title: "Designer",
        subtitle: "Mazars",
      },
    ],
  },
  {
    id: "benevolat",
    title: "Bénévolat",
    items: [
      {
        period: "2022 — Aujourd'hui",
        title: "Mentor design",
        subtitle: "Accompagnement de jeunes designers",
      },
    ],
  },
  {
    id: "formations",
    title: "Formations",
    items: [
      {
        period: "2015 — 2017",
        title: "Master Design graphique & interactif",
      },
      {
        period: "2012 — 2015",
        title: "Licence Arts appliqués",
      },
    ],
  },
  {
    id: "langues",
    title: "Langues",
    items: [
      { period: "", title: "Français", subtitle: "Langue maternelle" },
      { period: "", title: "Anglais", subtitle: "Courant — C1" },
    ],
  },
];
