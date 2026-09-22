import { Check, GitCommitHorizontal, MessageSquareWarning } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { GitHubActivity, GitHubActivityType } from "../../../types/github";

interface GitHubRecentActivityProps {
  activities: GitHubActivity[];
}

function ActivityIcon({ type }: { type: GitHubActivityType }) {
  if (type === "PR_APPROVED") {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
        <Check className="size-3.5" />
      </div>
    );
  }

  if (type === "PR_CHANGES_REQUESTED") {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <MessageSquareWarning className="size-3.5" />
      </div>
    );
  }

  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      <GitCommitHorizontal className="size-3.5" />
    </div>
  );
}

function ActivityRow({ activity }: { activity: GitHubActivity }) {
  return (
    <div className="flex min-w-0 gap-3 border-t px-4 py-3 first:border-t-0">
      <Avatar className="mt-0.5 size-7 shrink-0">
        {activity.actor.avatarUrl && (
          <AvatarImage
            src={activity.actor.avatarUrl}
            alt={activity.actor.name}
          />
        )}

        <AvatarFallback className="text-xs">
          {activity.actor.initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 gap-2">
          <ActivityIcon type={activity.type} />

          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground">{activity.message}</p>

            {activity.detail && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {activity.detail}
              </p>
            )}

            <p className="mt-1.5 text-xs text-muted-foreground">
              {activity.createdAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GitHubRecentActivity({
  activities,
}: GitHubRecentActivityProps) {
  return (
    <section className="min-w-0">
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Recent activity
        </h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          Latest GitHub activity for this project.
        </p>
      </div>

      {activities.length > 0 ? (
        <div className="border-t">
          {activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-40 flex-col items-center justify-center border-t px-4 py-8 text-center">
          <GitCommitHorizontal className="size-5 text-muted-foreground" />

          <p className="mt-3 text-sm font-medium text-foreground">
            No recent activity
          </p>

          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Repository activity will appear here after GitHub is synced.
          </p>
        </div>
      )}
    </section>
  );
}
