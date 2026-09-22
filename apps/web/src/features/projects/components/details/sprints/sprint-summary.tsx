import { CheckCircle2, Pencil, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import type { SprintSummaryData } from "./data/demo-sprints";

interface SprintSummaryProps {
  sprint: SprintSummaryData;
  completedTasks: number;
  totalTasks: number;
  remainingTasks: number;
  onEdit?: () => void;
  onComplete?: () => void;
}

export function SprintSummary({
  sprint,
  completedTasks,
  totalTasks,
  remainingTasks,
  onEdit,
  onComplete,
}: SprintSummaryProps) {
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="border-b border-border pb-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {sprint.name}
            </h2>

            <span className="inline-flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              <span className="size-2 rounded-full bg-success" />
              Active
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {sprint.startDate} – {sprint.endDate}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
            Edit sprint
          </Button>

          <Button type="button" className="gap-2" onClick={onComplete}>
            <CheckCircle2 className="size-4" />
            Complete sprint
          </Button>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 size-5 shrink-0 text-foreground" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">Goal</p>

            <p className="mt-1 text-sm text-muted-foreground">{sprint.goal}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4">
          <Progress value={progress} className="h-2 flex-1" />

          <div className="shrink-0 text-right">
            <p className="text-lg font-medium text-foreground">{progress}%</p>

            <p className="text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks complete
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x divide-border">
          <SprintMetric value={completedTasks} label="Completed" />

          <SprintMetric value={remainingTasks} label="Remaining" />

          <SprintMetric
            value={sprint.totalEstimate}
            label="Total estimate (pts)"
          />
        </div>
      </div>
    </div>
  );
}

interface SprintMetricProps {
  value: number;
  label: string;
}

function SprintMetric({ value, label }: SprintMetricProps) {
  return (
    <div className="px-4 first:pl-0">
      <p className="text-lg font-medium text-foreground">{value}</p>

      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
