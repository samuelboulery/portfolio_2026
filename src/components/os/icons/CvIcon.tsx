import type { SVGProps } from "react";

interface CvIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  title?: string;
}

export function CvIcon({ size = 24, title = "Curriculum vitae", ...rest }: CvIconProps) {
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
      <rect x={4} y={3} width={16} height={18} rx={1.5} />
      <circle cx={9.5} cy={9} r={2} />
      <path d="M6.5 15 Q9.5 12.5 12.5 15" />
      <path d="M14 8 H18" />
      <path d="M14 11 H18" />
      <path d="M7 18 H17" />
    </svg>
  );
}
