import { Clock3 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { ProjectDetails } from "../../../types/project";
import { Title } from "@/components/header-and-link";

interface RecentProjectActivityProps {
  project: ProjectDetails;
}

const avatarStyles = [
  "bg-primary/15 text-primary",
  "bg-info/15 text-info",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
  "bg-muted text-muted-foreground",
];

export function RecentProjectActivity({ project }: RecentProjectActivityProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border bg-card py-0 px-3 shadow-none">
      {/* ================================================
          HEADER
      ================================================= */}

      <Title
        title="Recent activity"
        actionLabel="View all activity"
        href="/workspace/activitys"
      />

      <Separator />

      {/* ================================================
          ACTIVITY LIST
      ================================================= */}

      {project.recentActivity.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center px-4 py-6">
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {project.recentActivity.map((activity, index) => (
            <div
              key={activity.id}
              className="flex min-w-0 items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              {/* User avatar */}

              <Avatar className="size-8 shrink-0">
                <AvatarFallback
                  className={`text-xs font-medium ${
                    avatarStyles[index % avatarStyles.length]
                  }`}
                >
                  {activity.actor.initials}
                </AvatarFallback>
              </Avatar>

              {/* Activity content */}

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-5 text-foreground">
                  <span className="font-medium">{activity.actor.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.message}
                  </span>
                </p>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />

                  <span>{activity.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
