import { AnalyticsMetricCard } from "./analytics-metric-card";

import type { AnalyticsMetric } from "@/features/projects/types/analytics";

interface AnalyticsMetricsProps {
  metrics: AnalyticsMetric[];
}

export function AnalyticsMetrics({ metrics }: AnalyticsMetricsProps) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <AnalyticsMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
