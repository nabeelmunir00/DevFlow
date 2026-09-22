import {
  CircleDot,
  Flag,
  GitPullRequest,
  List,
  MessageSquare,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type {
  ActivityMember,
  ProjectActivityCategory,
} from "../../../types/activity";

interface ActivitySidebarProps {
  members: ActivityMember[];
  activityCounts: {
    all: number;
    tasks: number;
    pullRequests: number;
    comments: number;
    sprints: number;
  };
  memberCounts: Record<string, number>;
  selectedCategory: "ALL" | ProjectActivityCategory;
  selectedMemberId: string | null;
  onCategoryChange: (value: "ALL" | ProjectActivityCategory) => void;
  onMemberChange: (memberId: string | null) => void;
}

const activityTypes = [
  {
    value: "ALL" as const,
    label: "All activity",
    icon: List,
    countKey: "all" as const,
  },
  {
    value: "TASK" as const,
    label: "Task updates",
    icon: CircleDot,
    countKey: "tasks" as const,
  },
  {
    value: "PULL_REQUEST" as const,
    label: "Pull requests",
    icon: GitPullRequest,
    countKey: "pullRequests" as const,
  },
  {
    value: "COMMENT" as const,
    label: "Comments",
    icon: MessageSquare,
    countKey: "comments" as const,
  },
  {
    value: "SPRINT" as const,
    label: "Sprint events",
    icon: Flag,
    countKey: "sprints" as const,
  },
];

export function ActivitySidebar({
  members,
  activityCounts,
  memberCounts,
  selectedCategory,
  selectedMemberId,
  onCategoryChange,
  onMemberChange,
}: ActivitySidebarProps) {
  const totalMembers = members.length;

  return (
    <aside className="grid content-start gap-3">
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold">Filter activity</h3>
        </div>

        <div className="p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Activity types
          </p>

          <div className="grid gap-1">
            {activityTypes.map((item) => {
              const Icon = item.icon;
              const active = selectedCategory === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onCategoryChange(item.value)}
                  className={[
                    "flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  <Icon className="size-4 shrink-0" />

                  <span className="flex-1 text-left">{item.label}</span>

                  <span className="text-xs">
                    {activityCounts[item.countKey]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold">Project members</h3>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => onMemberChange(null)}
            className={[
              "flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors",
              selectedMemberId === null
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted",
            ].join(" ")}
          >
            <Users className="size-4" />

            <span className="flex-1 text-left">All members</span>

            <span className="text-xs">{totalMembers}</span>
          </button>

          <div className="mt-1 grid gap-1">
            {members.map((member) => {
              const active = selectedMemberId === member.id;

              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => onMemberChange(member.id)}
                  className={[
                    "flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors",
                    active ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  ].join(" ")}
                >
                  <Avatar className="size-6">
                    {member.avatarUrl && (
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                    )}

                    <AvatarFallback className="text-xs">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>

                  <span className="min-w-0 flex-1 truncate text-left">
                    {member.name}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {memberCounts[member.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </aside>
  );
}
