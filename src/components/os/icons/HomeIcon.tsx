import type { SVGProps } from "react";

interface HomeIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  title?: string;
}

export function HomeIcon({ size = 24, title = "Accueil", ...rest }: HomeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      {...rest}
    >
      <title>{title}</title>
      <path d="M3 11 L12 3 L21 11 V20 A1 1 0 0 1 20 21 H4 A1 1 0 0 1 3 20 Z" />
      <path d="M9 21 V13 H15 V21" />
    </svg>
  );
}
