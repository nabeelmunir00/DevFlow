"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Project } from "../../types/project";

interface ProjectDetailsPageProps {
  project: Project;
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
          Temporary foundation.
          Next step: extract into project-details-header.tsx
      ====================================================== */}

      <div className="border-b border-border">
        <div className="flex min-w-0 flex-col gap-4 px-4 py-5 sm:px-6 2xl:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              {project.key}
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-foreground">
                {project.name}
              </h1>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  {project.key}
                </span>

                <span
                  aria-hidden="true"
                  className="size-1 rounded-full bg-muted-foreground"
                />

                <span className="truncate text-xs text-muted-foreground">
                  {project.description}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            PROJECT TABS

            Same URL:
            /workspace/project/[projectId]

            Tab switching does NOT create nested routes.
        ==================================================== */}

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ProjectTab)}
          className="min-w-0 gap-0"
        >
          <div className="min-w-0 overflow-x-auto border-t border-border px-4 sm:px-6 2xl:px-7">
            <TabsList className="h-12 w-max min-w-full justify-start gap-1 rounded-none bg-transparent p-0">
              {projectTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
                    h-12
                    flex-none
                    rounded-none
                    border-x-0
                    border-b-2
                    border-t-0
                    border-transparent
                    bg-transparent
                    px-3
                    text-sm
                    font-normal
                    text-muted-foreground
                    shadow-none
                    data-[state=active]:border-primary
                    data-[state=active]:bg-transparent
                    data-[state=active]:text-foreground
                    data-[state=active]:shadow-none
                  "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* =================================================
              PAGE CONTENT
          ================================================== */}

          <div className="min-w-0 px-4 py-5 sm:px-6 2xl:px-7">
            <TabsContent value="overview" className="m-0 min-w-0">
              <ProjectTabPlaceholder title="Project overview" />
            </TabsContent>

            <TabsContent value="board" className="m-0 min-w-0">
              <ProjectTabPlaceholder title="Project board" />
            </TabsContent>

            <TabsContent value="tasks" className="m-0 min-w-0">
              <ProjectTabPlaceholder title="Project tasks" />
            </TabsContent>

            <TabsContent value="sprints" className="m-0 min-w-0">
              <ProjectTabPlaceholder title="Project sprints" />
            </TabsContent>

            <TabsContent value="github" className="m-0 min-w-0">
              <ProjectTabPlaceholder title="GitHub integration" />
            </TabsContent>

            <TabsContent value="activity" className="m-0 min-w-0">
              <ProjectTabPlaceholder title="Project activity" />
            </TabsContent>

            <TabsContent value="analytics" className="m-0 min-w-0">
              <ProjectTabPlaceholder title="Project analytics" />
            </TabsContent>

            <TabsContent value="settings" className="m-0 min-w-0">
              <ProjectTabPlaceholder title="Project settings" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
