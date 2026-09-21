import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import type { ProjectDetails } from "../../../types/project";

interface ProjectProgressProps {
  project: ProjectDetails;
}

export function ProjectProgress({ project }: ProjectProgressProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      {/* ================================================
          HEADING
      ================================================= */}

      <div className="px-4 flex items-center justify-between py-2">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Project progress
        </h2>
        <p className="text-2xl font-bold font-heading  text-foreground">
          {project.progress}%
        </p>
      </div>

      {/* ================================================
          PROGRESS CONTENT
      ================================================= */}

      <div className="p-4">
        <Progress
          value={project.progress}
          aria-label={`${project.name} progress`}
          className=" h-2 w-full"
        />
        <p className="mt-4 text-accent-foreground">18 of 26 tasks complete</p>
      </div>
    </Card>
  );
}
