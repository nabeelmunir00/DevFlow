"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppChartTooltip } from "./app-chart-tooltip";

interface AppBarChartSeries<T extends object> {
  dataKey: keyof T & string;
  label: string;
  color?: string;
}

interface AppBarChartProps<T extends object> {
  data: T[];
  xKey: keyof T & string;
  series: AppBarChartSeries<T>[];
  height?: number;
  showYAxis?: boolean;
  showGrid?: boolean;
  barSize?: number;
  valueFormatter?: (value: string | number, name?: string) => string;
}

export function AppBarChart<T extends object>({
  data,
  xKey,
  series,
  height = 240,
  showYAxis = true,
  showGrid = true,
  barSize = 18,
  valueFormatter,
}: AppBarChartProps<T>) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            minTickGap={16}
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
              fill: "var(--muted)",
              opacity: 0.35,
            }}
            content={<AppChartTooltip valueFormatter={valueFormatter} />}
          />

          {series.map((item, index) => (
            <Bar
              key={item.dataKey}
              dataKey={item.dataKey}
              name={item.label}
              fill={
                item.color ??
                (index === 0 ? "var(--primary)" : "var(--muted-foreground)")
              }
              barSize={barSize}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
