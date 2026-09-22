import { ArrowUp } from "lucide-react";

import { AppBarChart } from "@/components/charts/app-bar-chart";
import { AppChartContainer } from "@/components/charts/app-chart-container";

import type { PullRequestThroughputDataPoint } from "@/features/projects/types/analytics";

interface PullRequestThroughputChartProps {
  data: PullRequestThroughputDataPoint[];
}

export function PullRequestThroughputChart({
  data,
}: PullRequestThroughputChartProps) {
  const totalMerged = data.reduce((total, item) => total + item.merged, 0);

  return (
    <AppChartContainer
      title="Pull request throughput"
      description="Merged pull requests over time"
      action={
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {totalMerged} merged
          </p>

          <div className="mt-1 flex items-center justify-end gap-1 text-xs font-medium text-success">
            <ArrowUp className="size-3.5" />
            33%
          </div>
        </div>
      }
    >
      <AppBarChart
        data={data}
        xKey="date"
        series={[
          {
            dataKey: "merged",
            label: "Merged",
          },
        ]}
        height={220}
        barSize={14}
      />
    </AppChartContainer>
  );
}
