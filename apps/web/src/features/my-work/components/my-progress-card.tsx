import { Progress } from "@/components/ui/progress";

import type { MyWorkProgress } from "../types/my-work";

interface MyProgressCardProps {
  progress: MyWorkProgress;
}

export function MyProgressCard({ progress }: MyProgressCardProps) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">My progress</h2>
      </div>

      <div className="p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {progress.percentage}%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Planned work completed
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            {progress.completed}/{progress.totalPlanned}
          </p>
        </div>

        <Progress value={progress.percentage} className="mt-3 h-2" />

        <div className="mt-4 grid grid-cols-3 divide-x divide-border">
          <ProgressMetric value={progress.completed} label="Completed" />

          <ProgressMetric value={progress.inProgress} label="In progress" />

          <ProgressMetric value={progress.remaining} label="Remaining" />
        </div>
      </div>
    </section>
  );
}

interface ProgressMetricProps {
  value: number;
  label: string;
}

function ProgressMetric({ value, label }: ProgressMetricProps) {
  return (
    <div className="px-2 text-center first:pl-0 last:pr-0">
      <p className="text-sm font-semibold text-foreground">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
