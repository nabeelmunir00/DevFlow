import { Check } from "lucide-react";

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
          className="gap-1.5 border-success/30 bg-success/10 text-success"
        >
          <Check className="size-3" />
          Completed
        </Badge>
      );

    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/10 text-primary"
        >
          In progress
        </Badge>
      );

    case "UPCOMING":
      return (
        <Badge variant="outline" className="text-muted-foreground">
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
            Completion across project milestones
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="grid min-w-0 gap-4 px-6 py-4 lg:grid-cols-12 lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3 lg:col-span-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs font-semibold text-muted-foreground">
                  {milestone.key}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {milestone.name}
                  </p>

                  <div className="mt-1 lg:hidden">
                    <MilestoneStatusBadge status={milestone.status} />
                  </div>
                </div>
              </div>

              <div className="hidden text-sm text-muted-foreground lg:block lg:col-span-2">
                {milestone.dueDate}
              </div>

              <div className="hidden text-sm text-muted-foreground lg:block lg:col-span-2">
                {milestone.tasks} tasks
              </div>

              <div className="min-w-0 lg:col-span-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground lg:hidden">
                    Progress
                  </span>

                  <span className="text-xs font-medium tabular-nums text-foreground">
                    {milestone.completion}%
                  </span>
                </div>

                <Progress value={milestone.completion} />
              </div>

              <div className="hidden justify-end lg:flex lg:col-span-1">
                <MilestoneStatusBadge status={milestone.status} />
              </div>

              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground lg:hidden">
                <span>{milestone.dueDate}</span>
                <span>{milestone.tasks} tasks</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
