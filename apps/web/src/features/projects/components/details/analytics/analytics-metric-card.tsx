import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type {
  AnalyticsMetric,
  AnalyticsTrendTone,
} from "@/features/projects/types/analytics";

interface AnalyticsMetricCardProps {
  metric: AnalyticsMetric;
}

function getTrendClasses(tone: AnalyticsTrendTone) {
  switch (tone) {
    case "POSITIVE":
      return "text-success";

    case "NEGATIVE":
      return "text-destructive";

    default:
      return "text-muted-foreground";
  }
}

function TrendIcon({
  direction,
}: {
  direction: AnalyticsMetric["trend"]["direction"];
}) {
  switch (direction) {
    case "UP":
      return <ArrowUp className="size-3.5" />;

    case "DOWN":
      return <ArrowDown className="size-3.5" />;

    default:
      return <Minus className="size-3.5" />;
  }
}

export function AnalyticsMetricCard({ metric }: AnalyticsMetricCardProps) {
  const trendClassName = getTrendClasses(metric.trend.tone);

  return (
    <Card className="min-w-0">
      <CardContent className="p-5">
        <p className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </p>

        <div className="mt-3 flex min-w-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </p>

            {metric.description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.description}
              </p>
            )}
          </div>

          <div
            className={`flex shrink-0 items-center gap-1 text-xs font-medium ${trendClassName}`}
          >
            <TrendIcon direction={metric.trend.direction} />

            <span>{metric.trend.value}%</span>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {metric.trend.label}
        </p>
      </CardContent>
    </Card>
  );
}
