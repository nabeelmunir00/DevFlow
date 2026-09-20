import { Icon } from "@iconify/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DashboardPanelHeader } from "./dashboard-panel-header";

export interface TeamActivityItem {
  id: string;
  user: {
    name: string;
    initials: string;
  };
  action: string;
  target: string;
  time: string;
}

interface TeamActivityProps {
  activities?: TeamActivityItem[];
}

const demoActivities: TeamActivityItem[] = [
  {
    id: "activity-1",
    user: {
      name: "Nabeel Munir",
      initials: "NM",
    },
    action: "moved",
    target: "Organization switcher to In Progress",
    time: "8 min ago",
  },
  {
    id: "activity-2",
    user: {
      name: "Hamza Ali",
      initials: "HA",
    },
    action: "opened pull request",
    target: "#142 Organization switcher",
    time: "24 min ago",
  },
  {
    id: "activity-3",
    user: {
      name: "Ali Raza",
      initials: "AR",
    },
    action: "completed",
    target: "Workspace loading states",
    time: "46 min ago",
  },
];

export function TeamActivity({
  activities = demoActivities,
}: TeamActivityProps) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      <DashboardPanelHeader
        title="Team activity"
        actionLabel="View all activity"
        href={`/workspace/activity`}
      />

      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="flex h-28 items-center justify-center px-4 text-center">
            <p className="text-sm text-muted-foreground">
              No recent team activity.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="group flex min-h-14 items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40"
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-muted text-xs font-medium text-foreground">
                    {activity.user.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-5 text-foreground">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">
                      {activity.action}
                    </span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon
                      icon="solar:clock-circle-linear"
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="whitespace-nowrap">{activity.time}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      />
                    }
                  >
                    <Icon
                      icon="solar:menu-dots-bold"
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="sr-only">
                      Actions for {activity.user.name}&apos;s activity
                    </span>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="min-w-36">
                    <DropdownMenuItem>
                      <Icon
                        icon="solar:eye-linear"
                        className="size-4"
                        aria-hidden="true"
                      />
                      View activity
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
