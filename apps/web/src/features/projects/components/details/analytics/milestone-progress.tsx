import { Check, Circle, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type {
  MilestoneStatus,
  ProjectMilestone,
} from "@/features/projects/types/analytics";

interface MilestoneProgressProps {
  milestones: ProjectMilestone[];
}

function MilestoneStatusBadge({ status }: { status: MilestoneStatus }) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-success/30 bg-success/10 text-success"
        >
          <Check className="size-3" />
          Completed
        </Badge>
      );

    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-primary/30 bg-primary/10 text-primary"
        >
          <Circle className="size-2 fill-current" />
          In progress
        </Badge>
      );

    case "UPCOMING":
      return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <Clock3 className="size-3" />
          Upcoming
        </Badge>
      );
  }
}

export function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Project progress by milestone
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Track progress across project milestones
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="divide-y divide-border">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="py-4 first:pt-0 last:pb-0">
              {/* Top */}
              <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {milestone.name}
                  </p>

                  <MilestoneStatusBadge status={milestone.status} />
                </div>

                <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                  {milestone.completion}%
                </span>
              </div>

              {/* Metadata */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>{milestone.key}</span>

                <span aria-hidden="true">·</span>

                <span>Due {milestone.dueDate}</span>

                <span aria-hidden="true">·</span>

                <span>{milestone.tasks} tasks</span>
              </div>

              {/* Progress */}
              <Progress value={milestone.completion} className="mt-3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
