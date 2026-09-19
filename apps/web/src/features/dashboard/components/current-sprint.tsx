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
  slug: string;
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

export function CurrentSprint({
  slug,
  sprint = demoSprint,
}: CurrentSprintProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border py-0 shadow-none">
      <DashboardPanelHeader
        title={sprint.name}
        actionLabel="View sprint"
        href={`/workspace/${slug}/sprints`}
      />

      <CardContent className="p-4">
        <div>
          <p className="text-xs text-muted-foreground">Goal</p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {sprint.goal}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon="solar:calendar-linear" className="size-4" />

            <span>
              {sprint.startDate}–{sprint.endDate}
            </span>
          </div>

          <span className="text-xs text-muted-foreground">
            {sprint.completedTasks} of {sprint.totalTasks} tasks
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Progress value={sprint.progress} className="h-1.5 flex-1" />

          <span className="w-8 text-right text-xs font-medium text-foreground">
            {sprint.progress}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
