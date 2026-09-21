import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { ProjectDetails } from "../../../types/project";

import { Title } from "@/components/header-and-link";

interface UpcomingDeadlinesProps {
  project: ProjectDetails;
}

export function UpcomingDeadlines({ project }: UpcomingDeadlinesProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border bg-card py-0 px-3 shadow-none">
      {/* ================================================
          HEADER
      ================================================= */}
      <Title
        title="Upcoming deadlines"
        actionLabel="View all"
        href="/workspace/activity"
      />

      <Separator />

      {/* ================================================
          DEADLINES
      ================================================= */}

      {project.upcomingDeadlines.length === 0 ? (
        <div className="flex min-h-28 items-center justify-center px-4 py-6">
          <p className="text-sm text-muted-foreground">
            No upcoming deadlines.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {project.upcomingDeadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex min-w-0 items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              {/* Deadline title */}

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <CalendarDays className="size-4" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-medium text-foreground"
                    title={deadline.title}
                  >
                    {deadline.title}
                  </p>
                </div>
              </div>

              {/* Date */}

              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {deadline.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
