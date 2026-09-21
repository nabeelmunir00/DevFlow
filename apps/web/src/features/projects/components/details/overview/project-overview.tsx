import { Icon } from "@iconify/react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Target,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type {
  ProjectDetails,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "../../../types/project";
import { RecentProjectTasks } from "./recent-project-tasks";
import { AboutProject } from "./about-project";
import { ProjectDetailsCard } from "./project-details-card";

interface ProjectOverviewProps {
  project: ProjectDetails;
}

const taskStatusStyles: Record<
  ProjectTaskStatus,
  {
    label: string;
    badge: string;
    dot: string;
  }
> = {
  TODO: {
    label: "To do",
    badge: "border-border bg-muted/40 text-muted-foreground",
    dot: "bg-muted-foreground",
  },

  IN_PROGRESS: {
    label: "In progress",
    badge: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
  },

  IN_REVIEW: {
    label: "In review",
    badge: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
  },

  DONE: {
    label: "Done",
    badge: "border-success/30 bg-success/10 text-success",
    dot: "bg-success",
  },
};

const priorityStyles: Record<
  ProjectTaskPriority,
  {
    label: string;
    className: string;
  }
> = {
  LOW: {
    label: "Low",
    className: "text-muted-foreground",
  },

  MEDIUM: {
    label: "Medium",
    className: "text-info",
  },

  HIGH: {
    label: "High",
    className: "text-warning",
  },

  URGENT: {
    label: "Urgent",
    className: "text-destructive",
  },
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,1fr)]">
      {/* =====================================================
          LEFT COLUMN
      ====================================================== */}

      <div className="grid min-w-0 gap-4">
        {/* ===================================================
            ABOUT THIS PROJECT
        ==================================================== */}

        <AboutProject description={project.description} goal={project.goal} />
        {/* ===================================================
            RECENT TASKS
        ==================================================== */}

        <RecentProjectTasks tasks={project.recentTasks} />

        {/* ===================================================
            RECENT ACTIVITY
        ==================================================== */}

        <Card className="gap-0 rounded-md border-border bg-card py-0 shadow-none">
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium text-foreground">
              Recent activity
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {project.recentActivity.length === 0 ? (
              <div className="flex min-h-32 items-center justify-center px-4">
                <p className="text-sm text-muted-foreground">
                  No recent activity.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {project.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex min-w-0 gap-3 px-4 py-3"
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="text-xs font-medium">
                        {activity.actor.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-5 text-foreground">
                        <span className="font-medium">
                          {activity.actor.name}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {activity.message}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.createdAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* =====================================================
          RIGHT COLUMN
      ====================================================== */}

      <div className="grid min-w-0 content-start gap-4">
        {/* ===================================================
            PROJECT PROGRESS
        ==================================================== */}

        <Card className="gap-0 rounded-md border-border bg-card py-0 shadow-none">
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium text-foreground">
              Project progress
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                  {project.progress}%
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Overall progress
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-foreground tabular-nums">
                  {project.completedTasks}/{project.totalTasks}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  tasks completed
                </p>
              </div>
            </div>

            <Progress
              value={project.progress}
              aria-label={`${project.name} progress`}
              className="mt-4 h-2"
            />
          </CardContent>
        </Card>

        {/* ===================================================
            PROJECT DETAILS
        ==================================================== */}

        <ProjectDetailsCard project={project} />

        {/* ===================================================
            REPOSITORY
        ==================================================== */}

        <Card className="gap-0 rounded-md border-border bg-card py-0 shadow-none">
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium text-foreground">
              Repository
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon
                  icon="mdi:github"
                  className="size-5 text-foreground"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium text-primary"
                  title={project.repository}
                >
                  {project.repository}
                </p>

                <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                  <Icon
                    icon="solar:branching-paths-down-linear"
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />

                  <span className="truncate">{project.defaultBranch}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===================================================
            UPCOMING DEADLINES
        ==================================================== */}

        <Card className="gap-0 rounded-md border-border bg-card py-0 shadow-none">
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium text-foreground">
              Upcoming deadlines
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {project.upcomingDeadlines.length === 0 ? (
              <div className="flex min-h-24 items-center justify-center px-4">
                <p className="text-sm text-muted-foreground">
                  No upcoming deadlines.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {project.upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex min-w-0 items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <CalendarDays
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />

                      <span
                        className="truncate text-sm text-foreground"
                        title={deadline.title}
                      >
                        {deadline.title}
                      </span>
                    </div>

                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {deadline.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
