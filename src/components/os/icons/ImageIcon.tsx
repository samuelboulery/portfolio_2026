import type { SVGProps } from "react";

interface ImageIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  title?: string;
}

export function ImageIcon({ size = 24, title = "Image", ...rest }: ImageIconProps) {
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
      <rect x={3} y={4} width={18} height={16} rx={2} />
      <circle cx={8.5} cy={9.5} r={1.5} />
      <path d="M3 17 L9 12 L14 17 L17 14 L21 18" />
    </svg>
  );
}
