import type { Project } from "../../types/project";

interface ProjectDetailsPageProps {
  project: Project;
  activeTab: string;
}

export function ProjectDetailsPage({ project }: ProjectDetailsPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="px-6 py-5 2xl:px-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {project.name}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Project detail page
        </p>
      </div>
    </div>
  );
}
