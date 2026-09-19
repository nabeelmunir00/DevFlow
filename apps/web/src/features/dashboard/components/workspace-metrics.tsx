import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface WorkspaceMetricsData {
  activeProjects?: number;
  openTasks?: number;
  sprintCompletion?: number;
  completedSprintTasks?: number;
  totalSprintTasks?: number;
  openPullRequests?: number;
  repositoryCount?: number;
  weeklyTaskChange?: number;
}

interface WorkspaceMetricsProps {
  data?: WorkspaceMetricsData;
}

export function WorkspaceMetrics({ data }: WorkspaceMetricsProps) {
  const metrics = [
    {
      label: "Active projects",
      value: data?.activeProjects ?? "8",
      description: "Across your workspace",
      icon: "solar:folder-with-files-linear",
      iconClassName: "text-primary",
    },
    {
      label: "Open tasks",
      value: data?.openTasks ?? "24",
      description:
        data?.weeklyTaskChange !== undefined
          ? `${data.weeklyTaskChange >= 0 ? "+" : ""}${data.weeklyTaskChange} this week`
          : "No weekly data",
      icon: "solar:check-circle-linear",
      iconClassName: "text-success",
    },
    {
      label: "Sprint completion",
      value:
        data?.sprintCompletion !== undefined
          ? `${data.sprintCompletion}%`
          : "70%",
      description:
        data?.completedSprintTasks !== undefined &&
        data?.totalSprintTasks !== undefined
          ? `${data.completedSprintTasks} of ${data.totalSprintTasks} tasks`
          : "No active sprint data",
      icon: "solar:chart-2-linear",
      iconClassName: "text-info",
    },
    {
      label: "Open pull requests",
      value: data?.openPullRequests ?? "4",
      description:
        data?.repositoryCount !== undefined
          ? `Across ${data.repositoryCount} repositories`
          : "No repository data",
      icon: "solar:branching-paths-down-linear",
      iconClassName: "text-primary",
    },
  ];

  return (
    <Card className="overflow-hidden rounded-md py-0 shadow-none">
      <CardContent className="p-0 ">
        <div className="grid sm:grid-cols-2  xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="relative flex min-h-30  items-center gap-4 px-5 py-4"
            >
              {index > 0 && (
                <Separator
                  orientation="vertical"
                  className="absolute inset-y-4 left-0 hidden h-auto xl:block"
                />
              )}

              <div
                className={`flex size-9 shrink-0 items-start justify-start ${metric.iconClassName}`}
              >
                <Icon icon={metric.icon} className="size-8" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{metric.label}</p>

                <p className="mt-1 text-3xl font-semibold leading-none tracking-tight text-foreground">
                  {metric.value}
                </p>

                <p className="mt-1.5 truncate text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
