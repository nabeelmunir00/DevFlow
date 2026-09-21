import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/header-and-link";

import type { ProjectDetails } from "../../../types/project";

interface UpcomingDeadlinesProps {
  project: ProjectDetails;
}

const deadlineStatusStyles = [
  {
    label: "In progress",
    dot: "bg-primary",
  },
  {
    label: "In review",
    dot: "bg-warning",
  },
  {
    label: "To do",
    dot: "bg-muted-foreground",
  },
];

export function UpcomingDeadlines({ project }: UpcomingDeadlinesProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border bg-card px-3 py-0 shadow-none">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Title
        title="Upcoming deadlines"
        actionLabel="View all"
        href="/workspace/tasks"
      />

      <Separator />

      {project.upcomingDeadlines.length === 0 ? (
        <div className="flex min-h-28 items-center justify-center py-6">
          <p className="text-sm text-muted-foreground">
            No upcoming deadlines.
          </p>
        </div>
      ) : (
        <div className="-mx-3">
          {/* =================================================
              TABLE HEADER
          ================================================== */}

          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_7rem] items-center border-b border-border px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Due date
            </span>

            <span className="text-xs font-medium text-muted-foreground">
              Task
            </span>

            <span className="text-xs font-medium text-muted-foreground">
              Status
            </span>
          </div>

          {/* =================================================
              DEADLINE ROWS
          ================================================== */}

          <div>
            {project.upcomingDeadlines.map((deadline, index) => {
              const status =
                deadlineStatusStyles[index % deadlineStatusStyles.length];

              const isToday = deadline.date.toLowerCase() === "today";

              return (
                <div
                  key={deadline.id}
                  className="grid grid-cols-[5.5rem_minmax(0,1fr)_7rem] items-center border-b border-border px-3 py-2.5 last:border-b-0"
                >
                  {/* Due date */}

                  <div className="flex min-w-0 items-center gap-2">
                    <CalendarDays
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />

                    <span
                      className={
                        isToday
                          ? "text-xs font-medium text-warning"
                          : "text-xs text-foreground"
                      }
                    >
                      {deadline.date}
                    </span>
                  </div>

                  {/* Task */}

                  <div className="min-w-0 pr-3">
                    <p
                      className="truncate text-sm text-foreground"
                      title={deadline.title}
                    >
                      {deadline.title}
                    </p>
                  </div>

                  {/* Status */}

                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`size-3 shrink-0 rounded-full ${status.dot}`}
                      aria-hidden="true"
                    />

                    <span className="truncate text-xs text-foreground">
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
