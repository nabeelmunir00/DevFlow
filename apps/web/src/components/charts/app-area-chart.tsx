"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppChartTooltip } from "./app-chart-tooltip";

interface AppAreaChartSeries<T extends object> {
  dataKey: keyof T & string;
  label: string;
  color?: string;
}

interface AppAreaChartProps<T extends object> {
  data: T[];
  xKey: keyof T & string;
  series: AppAreaChartSeries<T>[];
  height?: number;
  showYAxis?: boolean;
  showGrid?: boolean;
  valueFormatter?: (value: string | number, name?: string) => string;
}

export function AppAreaChart<T extends object>({
  data,
  xKey,
  series,
  height = 240,
  showYAxis = true,
  showGrid = true,
  valueFormatter,
}: AppAreaChartProps<T>) {
  const id = useId().replace(/:/g, "");

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            bottom: 0,
            left: 0,
          }}
        >
          <defs>
            {series.map((item, index) => {
              const color = item.color ?? "var(--primary)";

              return (
                <linearGradient
                  key={item.dataKey}
                  id={`${id}-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.2} />

                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>

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

          {series.map((item, index) => {
            const color = item.color ?? "var(--primary)";

            return (
              <Area
                key={item.dataKey}
                type="monotone"
                dataKey={item.dataKey}
                name={item.label}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${id}-${index})`}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "var(--background)",
                }}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
