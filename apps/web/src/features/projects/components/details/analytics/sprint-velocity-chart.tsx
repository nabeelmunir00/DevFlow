import { AppBarChart } from "@/components/charts/app-bar-chart";
import { AppChartContainer } from "@/components/charts/app-chart-container";

import type { SprintVelocityDataPoint } from "@/features/projects/types/analytics";

interface SprintVelocityChartProps {
  data: SprintVelocityDataPoint[];
}

export function SprintVelocityChart({ data }: SprintVelocityChartProps) {
  return (
    <AppChartContainer
      title="Sprint velocity"
      description="Committed vs. completed tasks"
      action={
        <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            Committed
          </div>

          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground" />
            Completed
          </div>
        </div>
      }
    >
      <AppBarChart
        data={data}
        xKey="sprint"
        series={[
          {
            dataKey: "committed",
            label: "Committed",
            color: "var(--primary)",
          },
          {
            dataKey: "completed",
            label: "Completed",
            color: "var(--muted-foreground)",
          },
        ]}
        height={260}
        barSize={16}
      />
    </AppChartContainer>
  );
}
