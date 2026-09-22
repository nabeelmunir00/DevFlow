import { ArrowDown } from "lucide-react";

import { AppAreaChart } from "@/components/charts/app-area-chart";
import { AppChartContainer } from "@/components/charts/app-chart-container";

import type { CycleTimeDataPoint } from "@/features/projects/types/analytics";

interface CycleTimeChartProps {
  data: CycleTimeDataPoint[];
}

export function CycleTimeChart({ data }: CycleTimeChartProps) {
  const currentValue = data.at(-1)?.days ?? 0;

  return (
    <AppChartContainer
      title="Cycle time"
      description="Average time from start to completion"
      action={
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {currentValue.toFixed(1)} days
          </p>

          <div className="mt-1 flex items-center justify-end gap-1 text-xs font-medium text-success">
            <ArrowDown className="size-3.5" />
            18%
          </div>
        </div>
      }
    >
      <AppAreaChart
        data={data}
        xKey="date"
        series={[
          {
            dataKey: "days",
            label: "Cycle time",
          },
        ]}
        height={220}
        valueFormatter={(value) => `${value} days`}
      />
    </AppChartContainer>
  );
}
