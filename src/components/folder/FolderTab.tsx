interface FolderTabProps {
  className?: string;
}

export function FolderTab({ className }: FolderTabProps) {
  return (
    <svg
      className={className}
      width="50"
      height="13"
      viewBox="0 0 50 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 0H46C48.2091 0 50 1.79086 50 4V13H0V4C0 1.79086 1.79086 0 4 0Z"
        fill="var(--project-folder-bg-1)"
      />
      <path
        d="M0.5 13V4C0.5 2.067 2.067 0.5 4 0.5H46C47.933 0.5 49.5 2.067 49.5 4V13"
        stroke="var(--project-folder-border-color)"
        strokeWidth="1"
      />
    </svg>
  );
}
