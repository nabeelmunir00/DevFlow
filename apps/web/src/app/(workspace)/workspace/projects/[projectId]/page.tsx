import { ProjectDetailsPage } from "@/features/projects/components/details/project-details-page";
import { demoProjectDetails } from "@/features/projects/types/demo-project-details";
import { notFound } from "next/navigation";

interface ProjectDetailsRouteProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailsRoute({
  params,
}: ProjectDetailsRouteProps) {
  const { projectId } = await params;

  const project = demoProjectDetails.find(
    (project) => project.id === projectId,
  );

  if (!project) {
    notFound();
  }

  return <ProjectDetailsPage project={project} />;
}
