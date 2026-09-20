import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { DashboardPanelHeader } from "./dashboard-panel-header";

interface SprintData {
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  completedTasks: number;
  totalTasks: number;
  progress: number;
}

interface CurrentSprintProps {
  sprint?: SprintData;
}

const demoSprint: SprintData = {
  name: "Sprint 06",
  goal: "Ship the collaboration foundation",
  startDate: "Sep 14",
  endDate: "Sep 25",
  completedTasks: 18,
  totalTasks: 26,
  progress: 69,
};

export function CurrentSprint({ sprint = demoSprint }: CurrentSprintProps) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      <DashboardPanelHeader
        title={sprint.name}
        actionLabel="View sprint"
        href="/workspace/sprints"
      />

      <CardContent className="p-4">
        {/* Sprint goal */}
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">Goal</p>

          <p className="mt-1 truncate text-sm font-medium leading-5 text-foreground">
            {sprint.goal}
          </p>
        </div>

        {/* Sprint metadata */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <Icon
              icon="solar:calendar-linear"
              className="size-4 shrink-0"
              aria-hidden="true"
            />

            <span className="whitespace-nowrap tabular-nums">
              {sprint.startDate} – {sprint.endDate}
            </span>
          </div>

          <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
            {sprint.completedTasks} of {sprint.totalTasks} tasks
          </span>
        </div>

        {/* Sprint progress */}
        <div className="mt-3 flex items-center gap-3">
          <Progress value={sprint.progress} className="h-1.5 min-w-0 flex-1" />

          <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">
            {sprint.progress}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
