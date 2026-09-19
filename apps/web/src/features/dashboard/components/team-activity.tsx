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
  slug: string;
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
  slug,
  activities = demoActivities,
}: TeamActivityProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border py-0 shadow-none">
      <DashboardPanelHeader
        title="Team activity"
        actionLabel="View all activity"
        href={`/workspace/${slug}/activity`}
      />

      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex min-h-14 items-center gap-3 px-4 py-2.5"
            >
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0"
                    />
                  }
                >
                  <Icon
                    icon="solar:menu-dots-bold"
                    className="size-4 text-muted-foreground"
                  />

                  <span className="sr-only">Activity actions</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View activity</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
