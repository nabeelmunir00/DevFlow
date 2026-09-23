import { CalendarClock, Clock3, Focus, GitPullRequest } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { TodayEvent } from "../types/my-work";

interface TodayCardProps {
  events: TodayEvent[];
  onStartFocus?: () => void;
}

export function TodayCard({ events, onStartFocus }: TodayCardProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Today</h2>
      </div>

      <div className="divide-y divide-border">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3 px-4 py-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
              {event.type === "REVIEW" ? (
                <GitPullRequest className="size-4 text-primary" />
              ) : (
                <CalendarClock className="size-4 text-warning" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{event.label}</p>

              <div className="mt-1 flex min-w-0 items-center gap-1.5">
                <span className="shrink-0 text-xs font-medium text-primary">
                  {event.taskKey}
                </span>

                <span className="truncate text-sm font-medium text-foreground">
                  {event.title}
                </span>
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 className="size-3.5" />
                {event.meta}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onStartFocus}
        >
          <Focus className="size-4" />
          Start focus work
        </Button>
      </div>
    </section>
  );
}
