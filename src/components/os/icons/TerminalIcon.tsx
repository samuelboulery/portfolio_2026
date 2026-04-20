import type { SVGProps } from "react";

interface TerminalIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  title?: string;
}

export function TerminalIcon({ size = 24, title = "Terminal", ...rest }: TerminalIconProps) {
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
      <path d="M5 7 L10 12 L5 17" />
      <path d="M12 18 H19" />
    </svg>
  );
}
