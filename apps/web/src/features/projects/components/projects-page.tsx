import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { ProjectsHeader } from "./projects-header";
import { ProjectsTable } from "./projects-table";
import { ProjectsToolbar } from "./projects-toolbar";
import { demoProjects } from "./data/demo-projects";

interface ProjectsPageProps {
  slug: string;
}

export function ProjectsPage({ slug }: ProjectsPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full px-6 py-5 2xl:px-7">
        <div className="space-y-4">
          <ProjectsHeader />

          <ProjectsToolbar />

          <ProjectsTable projects={demoProjects} />

          <div className="flex items-center justify-between border-b border-border pb-5 pt-1">
            <p className="text-sm text-muted-foreground">
              Showing {demoProjects.length} projects
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-md"
                disabled
              >
                <Icon icon="solar:alt-arrow-left-linear" className="size-4" />

                <span className="sr-only">Previous page</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-md border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              >
                1
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-md"
                disabled
              >
                <Icon icon="solar:alt-arrow-right-linear" className="size-4" />

                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
