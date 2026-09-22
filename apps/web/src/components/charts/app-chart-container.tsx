import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface AppChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AppChartContainer({
  title,
  description,
  children,
  action,
  className,
  contentClassName,
}: AppChartContainerProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </CardHeader>

      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
