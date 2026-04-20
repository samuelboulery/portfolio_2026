interface ClientLogoProps {
  slug: string;
}

const INITIALS: Readonly<Record<string, string>> = {
  edf: "e",
  mazars: "m",
  bonum: "b",
  greenweez: "g",
};

export function ClientLogo({ slug }: ClientLogoProps) {
  const letter = INITIALS[slug] ?? slug.charAt(0).toLowerCase();

  return (
    <svg
      width="32"
      height="18"
      viewBox="0 0 32 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <text
        x="16"
        y="15"
        textAnchor="middle"
        fontFamily="inherit"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
      >
        {letter}
      </text>
    </svg>
  );
}
