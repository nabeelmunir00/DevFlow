"use client";

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { ProjectDetails, ProjectTaskSummary } from "../../types/project";

import { ProjectBoard } from "./board/project-board";
import { ProjectOverview } from "./overview/project-overview";
import { ProjectTasks } from "./tasks/project-tasks";
import { ProjectDetailsHeader } from "./project-details-header";

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

const tabs: {
  value: ProjectTab;
  label: string;
}[] = [
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
];

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
          <TabPlaceholder
            title="Sprints"
            description="Sprint planning and management will be available here."
          />
        );

      case "github":
        return (
          <TabPlaceholder
            title="GitHub"
            description="Repository, pull requests, and commits will be available here."
          />
        );

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

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProjectTab)}
        className="min-w-0"
      >
        <div className="border-b border-border px-4 md:px-6">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative h-11 rounded-none border-0 bg-transparent px-0 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab.label}

                {activeTab === tab.value && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

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
