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
      <path d="M0 0H50V13H0Z" fill="var(--project-folder-bg-1)" />
      <path d="M0.5 13V0.5H49.5V13" stroke="var(--project-folder-border-color)" strokeWidth="1" />
    </svg>
  );
}
