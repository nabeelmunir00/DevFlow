import { Ellipsis } from "lucide-react";
import { Icon } from "@iconify/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/header-and-link";

import type { ProjectDetails } from "../../../types/project";

interface RecentProjectActivityProps {
  project: ProjectDetails;
}

const avatarStyles = [
  "bg-primary text-primary-foreground",
  "bg-info text-foreground",
  "bg-primary/70 text-primary-foreground",
  "bg-info/70 text-foreground",
];

export function RecentProjectActivity({ project }: RecentProjectActivityProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg border-border bg-card px-3 py-0 shadow-none">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Title
        title="Recent activity"
        actionLabel="View all activity"
        href="/workspace/activity"
      />

      <Separator />

      {/* =====================================================
          ACTIVITY LIST
      ====================================================== */}

      {project.recentActivity.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center py-6">
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        </div>
      ) : (
        <div className="relative pl-12">
          <div
            aria-hidden="true"
            className="absolute bottom-5 left-3 top-5 w-px bg-border"
          />

          {project.recentActivity.map((activity, index) => (
            <div
              key={activity.id}
              className="relative border-b border-border py-3 last:border-b-0"
            >
              {/* Timeline marker */}

              <div className="absolute -left-11 top-5 z-10 flex size-4 items-center justify-center rounded-full border-2 border-muted-foreground bg-card">
                <span className="size-1 rounded-full bg-muted-foreground" />
              </div>

              {/* Activity row */}

              <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-3">
                {/* Actor */}

                {index === 1 ? (
                  <div className="flex size-8 shrink-0 items-center justify-center">
                    <Icon
                      icon="mdi:github"
                      className="size-7 text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback
                      className={`text-xs font-medium ${
                        avatarStyles[index % avatarStyles.length]
                      }`}
                    >
                      {activity.actor.initials}
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Content */}

                <div className="min-w-0 pt-0.5">
                  <p className="text-sm leading-5 text-foreground">
                    <span className="font-medium">{activity.actor.name}</span>{" "}
                    <span className="text-muted-foreground">
                      {activity.message}
                    </span>
                  </p>

                  {/* Demo secondary text to match screenshot */}

                  {index === 0 && (
                    <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                      “This looks good! I&apos;ll test with a few more cases.”
                    </p>
                  )}

                  {index === 1 && (
                    <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                      by Ahmed Hassan
                    </p>
                  )}

                  {index === 3 && (
                    <p className="mt-0.5 truncate text-sm leading-5 text-muted-foreground">
                      feat: add empty state
                      <span className="px-2">•</span>
                      fix: sidebar responsive
                      <span className="px-2">•</span>
                      chore: update deps
                    </p>
                  )}
                </div>

                {/* Time */}
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap pt-0.5 text-sm text-muted-foreground">
                    {activity.createdAt}
                  </span>

                  {/* More */}

                  <button
                    type="button"
                    aria-label={`More options for ${activity.actor.name}`}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Ellipsis className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
