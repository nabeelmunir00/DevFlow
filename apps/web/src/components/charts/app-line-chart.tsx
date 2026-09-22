"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppChartTooltip } from "./app-chart-tooltip";

export interface AppLineChartSeries {
  dataKey: string;
  label: string;
  color?: string;
  strokeWidth?: number;
}

interface AppLineChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  series: AppLineChartSeries[];
  height?: number;
  showYAxis?: boolean;
  showGrid?: boolean;
  valueFormatter?: (value: string | number, name?: string) => string;
}

export function AppLineChart({
  data,
  xKey,
  series,
  height = 240,
  showYAxis = true,
  showGrid = true,
  valueFormatter,
}: AppLineChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            bottom: 0,
            left: 0,
          }}
        >
          {showGrid && (
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
          )}

          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--muted-foreground)",
              fontSize: 12,
            }}
            tickMargin={10}
            minTickGap={24}
          />

          {showYAxis && (
            <YAxis
              axisLine={false}
              tickLine={false}
              width={36}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />
          )}

          <Tooltip
            cursor={{
              stroke: "var(--border)",
              strokeDasharray: "3 3",
            }}
            content={<AppChartTooltip valueFormatter={valueFormatter} />}
          />

          {series.map((item) => (
            <Line
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.label}
              stroke={item.color ?? "var(--primary)"}
              strokeWidth={item.strokeWidth ?? 2}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                fill: "var(--background)",
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
