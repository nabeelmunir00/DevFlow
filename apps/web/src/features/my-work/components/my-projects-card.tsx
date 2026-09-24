import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { MyWorkProject } from "../types/my-work";

interface MyProjectsCardProps {
  projects: MyWorkProject[];
}

const accentClasses: Record<MyWorkProject["accent"], string> = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
};

export function MyProjectsCard({ projects }: MyProjectsCardProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">My projects</h2>

        <Button
          nativeButton={false}
          variant="ghost"
          size="sm"
          render={<Link href="/workspace/project" />}
        >
          View all
          <ArrowUpRight className="size-4" />
        </Button>
      </div>

      <div className="divide-y divide-border">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/workspace/project/${project.id}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/40"
          >
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                accentClasses[project.accent],
              )}
            />

            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {project.name}
            </span>

            <span className="text-xs text-muted-foreground">
              {project.taskCount} tasks
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
