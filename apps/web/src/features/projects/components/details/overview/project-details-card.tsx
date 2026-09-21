import { CalendarDays, Goal, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import type { ProjectDetails } from "../../../types/project";

interface ProjectDetailsCardProps {
  project: ProjectDetails;
}

export function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  const sprintProgress = 69;

  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      {/* ================================================
          HEADING
      ================================================= */}

      <div className="px-4 py-3">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Project details
        </h2>
      </div>

      <Separator />

      {/* ================================================
          DETAILS
      ================================================= */}

      <div className="divide-y divide-border">
        {/* Owner */}

        <div className="grid min-w-0 grid-cols-2 items-center gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <User className="size-6 shrink-0" aria-hidden="true" />

            <span>Owner</span>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-6 shrink-0 rounded-full">
              <AvatarFallback className="text-xs font-medium">
                {project.owner.initials}
              </AvatarFallback>
            </Avatar>

            <span
              className="min-w-0 truncate text-sm font-medium text-foreground"
              title={project.owner.name}
            >
              {project.owner.name}
            </span>
          </div>
        </div>

        {/* Due date */}

        <div className="grid min-w-0 grid-cols-2 items-center gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-6 shrink-0" aria-hidden="true" />

            <span>Due date</span>
          </div>

          <div className="min-w-0">
            <span className="text-sm text-foreground tabular-nums">
              {project.dueDate}
            </span>
          </div>
        </div>

        {/* Current sprint */}

        <div className="grid min-w-0 grid-cols-2 items-start gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Goal className="size-6 shrink-0" aria-hidden="true" />

            <span>Current sprint</span>
          </div>

          <div className="min-w-0 space-y-2">
            <h3 className="truncate text-sm font-medium text-foreground">
              {project.sprint}
            </h3>

            <Progress value={sprintProgress} className="h-2 w-full" />

            <p className="text-xs text-muted-foreground">
              18 of 26 tasks{" "}
              <span className="tabular-nums">({sprintProgress}%)</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
