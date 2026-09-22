"use client";

interface TooltipPayloadItem {
  name?: string;
  value?: string | number;
  color?: string;
  dataKey?: string | number;
}

interface AppChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayloadItem[];
  valueFormatter?: (value: string | number, name?: string) => string;
}

export function AppChartTooltip({
  active,
  label,
  payload,
  valueFormatter,
}: AppChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-32 rounded-md border border-border bg-popover px-3 py-2 shadow-sm">
      {label !== undefined && (
        <p className="mb-2 text-xs font-medium text-foreground">{label}</p>
      )}

      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          if (item.value === undefined) {
            return null;
          }

          const name = item.name ?? String(item.dataKey ?? "Value");

          return (
            <div
              key={`${String(item.dataKey)}-${index}`}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color ?? "currentColor",
                  }}
                />

                <span className="truncate text-muted-foreground">{name}</span>
              </div>

              <span className="shrink-0 font-medium tabular-nums text-foreground">
                {valueFormatter ? valueFormatter(item.value, name) : item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
