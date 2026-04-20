import type { SVGProps } from "react";

interface FolderIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  title?: string;
}

export function FolderIcon({ size = 24, title = "Dossier", ...rest }: FolderIconProps) {
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
      <path d="M3 7 A2 2 0 0 1 5 5 H9 L11 7 H19 A2 2 0 0 1 21 9 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 Z" />
    </svg>
  );
}
