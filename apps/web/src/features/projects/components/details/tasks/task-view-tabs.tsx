"use client";

import { Button } from "@/components/ui/button";

export type TaskView = "all" | "open" | "completed";

interface TaskViewTabsProps {
  value: TaskView;
  onValueChange: (value: TaskView) => void;
  counts: Record<TaskView, number>;
}

const views: {
  value: TaskView;
  label: string;
}[] = [
  {
    value: "all",
    label: "All tasks",
  },
  {
    value: "open",
    label: "Open",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

export function TaskViewTabs({
  value,
  onValueChange,
  counts,
}: TaskViewTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {views.map((view) => {
        const isActive = value === view.value;

        return (
          <Button
            key={view.value}
            type="button"
            variant={isActive ? "secondary" : "outline"}
            onClick={() => onValueChange(view.value)}
            className={[
              "h-10 gap-3 font-normal",
              isActive &&
                "border-primary bg-primary/10 text-foreground hover:bg-primary/10",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {view.label}

            <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
              {counts[view.value]}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
