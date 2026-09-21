"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { ProjectDetails } from "../../types/project";

import { ProjectDetailsHeader } from "./project-details-header";

interface ProjectDetailsPageProps {
  project: ProjectDetails;
}

export type ProjectTab =
  | "overview"
  | "board"
  | "tasks"
  | "sprints"
  | "github"
  | "activity"
  | "analytics"
  | "settings";

interface ProjectTabItem {
  value: ProjectTab;
  label: string;
}

const projectTabs: ProjectTabItem[] = [
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

function ProjectTabPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-md border border-dashed border-border">
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{title}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          This section will be implemented next.
        </p>
      </div>
    </div>
  );
}

export function ProjectDetailsPage({ project }: ProjectDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* =====================================================
          PROJECT HEADER
      ====================================================== */}

      <ProjectDetailsHeader project={project} />

      {/* =====================================================
          PROJECT TABS

          URL always stays:
          /workspace/project/[projectId]

          Tabs only change local UI state.
      ====================================================== */}

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProjectTab)}
        className="min-w-0 gap-0"
      >
        {/* ===================================================
            TAB NAVIGATION
        ==================================================== */}

        <div className="min-w-0 border-b border-border">
          <div className="overflow-x-auto px-4 sm:px-6 2xl:px-7">
            <TabsList className="h-12 w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0">
              {projectTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
                    relative
                    h-12
                    flex-none
                    rounded-none
                    border-0
                    bg-transparent
                    px-3
                    text-sm
                    font-normal
                    text-muted-foreground
                    shadow-none
                    transition-colors
                    hover:text-foreground
                    data-[state=active]:bg-transparent
                    data-[state=active]:text-foreground
                    data-[state=active]:shadow-none
                    after:absolute
                    after:inset-x-3
                    after:bottom-0
                    after:h-0.5
                    after:scale-x-0
                    after:bg-primary
                    after:transition-transform
                    data-[state=active]:after:scale-x-100
                  "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* ===================================================
            TAB CONTENT
        ==================================================== */}

        <div className="min-w-0 px-4 py-5 sm:px-6 2xl:px-7">
          {/* Overview */}

          <TabsContent value="overview" className="m-0 min-w-0">
            <ProjectTabPlaceholder title="Project overview" />
          </TabsContent>

          {/* Board */}

          <TabsContent value="board" className="m-0 min-w-0">
            <ProjectTabPlaceholder title="Project board" />
          </TabsContent>

          {/* Tasks */}

          <TabsContent value="tasks" className="m-0 min-w-0">
            <ProjectTabPlaceholder title="Project tasks" />
          </TabsContent>

          {/* Sprints */}

          <TabsContent value="sprints" className="m-0 min-w-0">
            <ProjectTabPlaceholder title="Project sprints" />
          </TabsContent>

          {/* GitHub */}

          <TabsContent value="github" className="m-0 min-w-0">
            <ProjectTabPlaceholder title="GitHub integration" />
          </TabsContent>

          {/* Activity */}

          <TabsContent value="activity" className="m-0 min-w-0">
            <ProjectTabPlaceholder title="Project activity" />
          </TabsContent>

          {/* Analytics */}

          <TabsContent value="analytics" className="m-0 min-w-0">
            <ProjectTabPlaceholder title="Project analytics" />
          </TabsContent>

          {/* Settings */}

          <TabsContent value="settings" className="m-0 min-w-0">
            <ProjectTabPlaceholder title="Project settings" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
