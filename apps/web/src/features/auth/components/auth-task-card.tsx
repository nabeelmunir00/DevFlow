import { CheckSquare2, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";

type TaskVariant = "info" | "warning";

interface AuthTaskCardProps {
  project: string;
  initials: string;
  title: string;
  status: string;
  progress: string;
  comments: number;
  members: string[];
  variant: TaskVariant;
  className?: string;
}

const variantStyles: Record<
  TaskVariant,
  {
    icon: string;
    status: string;
  }
> = {
  info: {
    icon: "bg-primary text-primary-foreground",
    status: "bg-info/10 text-info",
  },

  warning: {
    icon: "bg-success text-success-foreground",
    status: "bg-warning/10 text-warning",
  },
};

export function AuthTaskCard({
  project,
  initials,
  title,
  status,
  progress,
  comments,
  members,
  variant,
  className,
}: AuthTaskCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
              styles.icon,
            )}
          >
            {initials}
          </div>

          <span className="truncate text-sm text-muted-foreground">
            {project}
          </span>
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
            styles.status,
          )}
        >
          <span className="size-2 rounded-full bg-current" />
          {status}
        </div>
      </div>

      <h3 className="mt-4 font-medium text-card-foreground">{title}</h3>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CheckSquare2 className="size-4" />
            {progress}
          </span>

          <span className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            {comments}
          </span>
        </div>

        <div className="flex -space-x-2">
          {members.map((member, index) => (
            <div
              key={`${member}-${index}`}
              className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-medium text-secondary-foreground"
            >
              {member}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
