"use client";

import { useMemo, useState } from "react";

import type { ProjectDetails } from "../../../types/project";
import type {
  ProjectActivityCategory,
  ProjectActivityGroup,
} from "../../../types/activity";

import { ActivityCategoryTabs } from "./activity-category-tabs";
import type { ActivityCategoryFilter } from "./activity-category-tabs";
import { ActivityFeed } from "./activity-feed";
import { ActivitySidebar } from "./activity-sidebar";
import { ActivityToolbar } from "./activity-toolbar";
import { demoActivityMembers, demoProjectActivity } from "./data/demo-activity";

interface ProjectActivityProps {
  project: ProjectDetails;
}

export function ProjectActivity({ project: _project }: ProjectActivityProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ActivityCategoryFilter>("ALL");
  const [memberId, setMemberId] = useState<string | null>(null);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return demoProjectActivity
      .map((group) => {
        const activities = group.activities.filter((activity) => {
          const matchesCategory =
            category === "ALL" || activity.category === category;

          const matchesMember = !memberId || activity.actor.id === memberId;

          const matchesSearch =
            !query ||
            activity.actor.name.toLowerCase().includes(query) ||
            activity.message.toLowerCase().includes(query) ||
            activity.target?.label.toLowerCase().includes(query) ||
            activity.description?.toLowerCase().includes(query) ||
            activity.commits?.some((commit) =>
              commit.toLowerCase().includes(query),
            );

          return matchesCategory && matchesMember && Boolean(matchesSearch);
        });

        return {
          ...group,
          activities,
        };
      })
      .filter((group) => group.activities.length > 0);
  }, [category, memberId, search]);

  const allActivities = useMemo(
    () => demoProjectActivity.flatMap((group) => group.activities),
    [],
  );

  const activityCounts = useMemo(() => {
    return {
      all: allActivities.length,

      tasks: allActivities.filter((activity) => activity.category === "TASK")
        .length,

      pullRequests: allActivities.filter(
        (activity) => activity.category === "PULL_REQUEST",
      ).length,

      comments: allActivities.filter(
        (activity) => activity.category === "COMMENT",
      ).length,

      sprints: allActivities.filter(
        (activity) => activity.category === "SPRINT",
      ).length,
    };
  }, [allActivities]);

  const memberCounts = useMemo(() => {
    return allActivities.reduce<Record<string, number>>((counts, activity) => {
      counts[activity.actor.id] = (counts[activity.actor.id] ?? 0) + 1;

      return counts;
    }, {});
  }, [allActivities]);

  function handleCategoryChange(value: "ALL" | ProjectActivityCategory) {
    setCategory(value);
  }

  return (
    <div className="min-w-0 px-5 py-5">
      <ActivityToolbar search={search} onSearchChange={setSearch} />

      <div className="mt-4">
        <ActivityCategoryTabs value={category} onValueChange={setCategory} />
      </div>

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-4">
        <main className="min-w-0 xl:col-span-3">
          <ActivityFeed groups={filteredGroups} />
        </main>

        <ActivitySidebar
          members={demoActivityMembers}
          activityCounts={activityCounts}
          memberCounts={memberCounts}
          selectedCategory={category}
          selectedMemberId={memberId}
          onCategoryChange={handleCategoryChange}
          onMemberChange={setMemberId}
        />
      </div>
    </div>
  );
}
