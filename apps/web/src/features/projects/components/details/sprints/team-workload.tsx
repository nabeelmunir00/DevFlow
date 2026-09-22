import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import type { TeamWorkloadMember } from "./data/demo-sprints";

interface TeamWorkloadProps {
  members: TeamWorkloadMember[];
}

export function TeamWorkload({ members }: TeamWorkloadProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Team workload</h3>
      </div>

      <div className="space-y-4 p-4">
        {members.map((member) => {
          const overCapacity = member.assigned > member.capacity;

          const percentage =
            member.capacity > 0
              ? Math.min((member.assigned / member.capacity) * 100, 100)
              : 0;

          return (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm text-foreground">
                    {member.name}
                  </p>

                  <p
                    className={
                      overCapacity
                        ? "shrink-0 text-xs text-destructive"
                        : "shrink-0 text-xs text-muted-foreground"
                    }
                  >
                    {member.assigned} / {member.capacity} pts
                  </p>
                </div>

                <Progress value={percentage} className="mt-2 h-1.5" />

                {overCapacity && (
                  <p className="mt-1 text-right text-xs text-destructive">
                    Over capacity
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
