"use client";

import { useState } from "react";

import type { ProjectDetails, ProjectTaskSummary } from "../../types/project";
import { AppTabs, type AppTab } from "@/components/shared/app-tabs";

import { ProjectBoard } from "./board/project-board";
import { ProjectOverview } from "./overview/project-overview";
import { ProjectTasks } from "./tasks/project-tasks";
import { ProjectDetailsHeader } from "./project-details-header";
import { ProjectSprints } from "./sprints/project-sprints";
import { ProjectGitHub } from "./github/project-github";

type ProjectTab =
  | "overview"
  | "board"
  | "tasks"
  | "sprints"
  | "github"
  | "activity"
  | "analytics"
  | "settings";

interface ProjectDetailsPageProps {
  project: ProjectDetails;
}

const projectTabs = [
  {
    value: "overview",
    label: "Overview",
  },
  {
    value: "board",
    label: "Board",
  },
  {
    value: "tasks",
    label: "Tasks",
  },
  {
    value: "sprints",
    label: "Sprints",
  },
  {
    value: "github",
    label: "GitHub",
  },
  {
    value: "activity",
    label: "Activity",
  },
  {
    value: "analytics",
    label: "Analytics",
  },
  {
    value: "settings",
    label: "Settings",
  },
] satisfies readonly AppTab<ProjectTab>[];

export function ProjectDetailsPage({ project }: ProjectDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");

  const [tasks, setTasks] = useState<ProjectTaskSummary[]>(project.recentTasks);

  function renderTabContent() {
    switch (activeTab) {
      case "overview":
        return <ProjectOverview project={project} />;

      case "board":
        return (
          <ProjectBoard
            project={project}
            tasks={tasks}
            onTasksChange={setTasks}
          />
        );

      case "tasks":
        return (
          <ProjectTasks
            project={project}
            tasks={tasks}
            onTasksChange={setTasks}
          />
        );

      case "sprints":
        return (
          <ProjectSprints
            project={project}
            tasks={tasks}
            onTasksChange={setTasks}
          />
        );

      case "github":
        return <ProjectGitHub project={project} />;

      case "activity":
        return (
          <TabPlaceholder
            title="Activity"
            description="Project activity and history will be available here."
          />
        );

      case "analytics":
        return (
          <TabPlaceholder
            title="Analytics"
            description="Project analytics and insights will be available here."
          />
        );

      case "settings":
        return (
          <TabPlaceholder
            title="Settings"
            description="Project configuration and settings will be available here."
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-w-0">
      <ProjectDetailsHeader project={project} />

      <AppTabs
        tabs={projectTabs}
        value={activeTab}
        onValueChange={setActiveTab}
        ariaLabel="Project sections"
      />

      <div className="min-w-0 p-4 md:p-6">{renderTabContent()}</div>
    </div>
  );
}

interface TabPlaceholderProps {
  title: string;
  description: string;
}

function TabPlaceholder({ title, description }: TabPlaceholderProps) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-border">
      <div className="max-w-md px-6 text-center">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
