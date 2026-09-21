import { ExternalLink, GitBranch } from "lucide-react";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { ProjectDetails } from "../../../types/project";

interface ProjectRepositoryProps {
  project: ProjectDetails;
}

export function ProjectRepository({ project }: ProjectRepositoryProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Repository
        </h2>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-md text-muted-foreground hover:text-foreground"
          aria-label="Open repository"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <Separator />

      <div className="p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
            <Icon icon="mdi:github" className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-medium text-primary"
              title={project.repository}
            >
              {project.repository}
            </p>

            <div className="mt-1.5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <GitBranch className="size-4 shrink-0" aria-hidden="true" />

              <span className="truncate">{project.defaultBranch}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
