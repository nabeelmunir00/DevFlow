import { CircleCheck, GitBranch } from "lucide-react";
import { Icon } from "@iconify/react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/header-and-link";

import type { ProjectDetails } from "../../../types/project";

interface ProjectRepositoryProps {
  project: ProjectDetails;
}

export function ProjectRepository({ project }: ProjectRepositoryProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg border-border bg-card px-4 py-0 shadow-none">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Title
        title="Repository"
        actionLabel="Open in Github"
        href="/workspace/github"
      />

      <Separator />

      {/* =====================================================
          REPOSITORY
      ====================================================== */}

      <div className="flex min-w-0 items-start gap-3 py-4">
        <div className="flex size-9 shrink-0 items-center justify-center">
          <Icon
            icon="mdi:github"
            className="size-6 text-foreground"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-sm font-medium text-foreground"
            title={project.repository}
          >
            {project.repository}
          </h3>

          <div className="mt-1 flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full bg-success"
              aria-hidden="true"
            />

            <p className="text-xs text-muted-foreground">Synced 2 min ago</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* =====================================================
          REPOSITORY STATUS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Open pull requests */}

        <div className="flex min-w-0 items-center gap-3 py-3 sm:pr-4">
          <GitBranch
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <span className="truncate text-sm text-muted-foreground">
              Open pull requests
            </span>

            <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
              4
            </span>
          </div>
        </div>

        {/* Checks */}

        <div className="flex min-w-0 items-center gap-3 border-t border-border py-3 sm:border-l sm:border-t-0 sm:pl-4">
          <CircleCheck
            className="size-5 shrink-0 text-success"
            aria-hidden="true"
          />

          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Checks</span>

            <span className="shrink-0 text-sm  font-medium text-success">
              All passed
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
