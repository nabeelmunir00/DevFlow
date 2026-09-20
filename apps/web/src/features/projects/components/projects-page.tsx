"use client";

import { useState } from "react";

import { ProjectsGrid } from "./projects-grid";
import { ProjectsHeader } from "./projects-header";
import { ProjectsTable } from "./projects-table";
import { type ProjectView, ProjectsToolbar } from "./projects-toolbar";
import { demoProjects } from "./data/demo-projects";

export function ProjectsPage() {
  const [view, setView] = useState<ProjectView>("list");

  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full px-6 py-5 2xl:px-7">
        <div className="space-y-4">
          <ProjectsHeader />

          <ProjectsToolbar view={view} onViewChange={setView} />

          {view === "list" ? (
            <ProjectsTable
              projects={demoProjects}
              selectedProjectId={demoProjects[0]?.id}
            />
          ) : (
            <ProjectsGrid projects={demoProjects} />
          )}
        </div>
      </div>
    </div>
  );
}
