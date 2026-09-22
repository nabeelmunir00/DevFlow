import { AppAreaChart } from "@/components/charts/app-area-chart";
import { AppChartContainer } from "@/components/charts/app-chart-container";

import type { TaskCompletionDataPoint } from "@/features/projects/types/analytics";

interface TaskCompletionChartProps {
  data: TaskCompletionDataPoint[];
}

export function TaskCompletionChart({ data }: TaskCompletionChartProps) {
  return (
    <AppChartContainer
      title="Task completion over time"
      description="Cumulative tasks completed"
    >
      <AppAreaChart
        data={data}
        xKey="date"
        series={[
          {
            dataKey: "completed",
            label: "Completed",
          },
        ]}
        height={260}
      />
    </AppChartContainer>
  );
}
