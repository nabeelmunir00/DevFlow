import { Badge } from "@/components/ui/badge";

import type { ProjectStatus } from "../types/project";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const statusStyles: Record<
  ProjectStatus,
  {
    label: string;
    badge: string;
    dot: string;
  }
> = {
  IN_PROGRESS: {
    label: "In progress",
    badge: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
  },

  IN_REVIEW: {
    label: "In review",
    badge: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
  },

  ON_TRACK: {
    label: "On track",
    badge: "border-success/30 bg-success/10 text-success",
    dot: "bg-success",
  },

  BLOCKED: {
    label: "Blocked",
    badge: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = statusStyles[status];

  return (
    <Badge
      variant="outline"
      className={`h-6 gap-1.5 rounded-full px-2 py-0 text-xs font-normal ${config.badge}`}
    >
      <span
        aria-hidden="true"
        className={`size-2.5 shrink-0 rounded-full ${config.dot}`}
      />

      {config.label}
    </Badge>
  );
}
