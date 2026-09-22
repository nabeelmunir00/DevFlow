import type { ProjectActivityGroup } from "../../../types/activity";

import { ActivityGroup } from "./activity-group";

interface ActivityFeedProps {
  groups: ProjectActivityGroup[];
}

export function ActivityFeed({ groups }: ActivityFeedProps) {
  if (!groups.length) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-lg border bg-card p-8 text-center">
        <div>
          <p className="font-medium">No activity found</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {groups.map((group) => (
        <ActivityGroup key={group.id} group={group} />
      ))}
    </div>
  );
}
