import type { ProjectActivityGroup as ActivityGroupType } from "../../../types/activity";

import { ActivityItem } from "./activity-item";

interface ActivityGroupProps {
  group: ActivityGroupType;
}

export function ActivityGroup({ group }: ActivityGroupProps) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <h3 className="text-sm font-semibold">{group.label}</h3>

        <span className="text-xs text-muted-foreground">
          {group.activities.length}{" "}
          {group.activities.length === 1 ? "event" : "events"}
        </span>
      </div>

      <div>
        {group.activities.map((activity, index) => (
          <div key={activity.id} className="border-b last:border-b-0">
            <ActivityItem
              activity={activity}
              isLast={index === group.activities.length - 1}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
