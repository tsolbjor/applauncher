import type { LucideIcon } from "lucide-react";
import type { SimpleIcon } from "simple-icons";

interface ToolLogoProps {
  icon:
    | { type: "simple"; icon: SimpleIcon }
    | { type: "lucide"; icon: LucideIcon };
  className?: string;
}

export function ToolLogo({ icon, className }: ToolLogoProps) {
  if (icon.type === "lucide") {
    const Icon = icon.icon;
    return <Icon aria-hidden="true" className={className} />;
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      style={{ color: `#${icon.icon.hex}` }}
    >
      <path d={icon.icon.path} />
    </svg>
  );
}
