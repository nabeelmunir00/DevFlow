import { notFound } from "next/navigation";

import { demoProjects } from "@/features/projects/components/data/demo-projects";
import { ProjectDetailsPage } from "@/features/projects/components/details/project-details-page";

interface ProjectDetailsRouteProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailsRoute({
  params,
}: ProjectDetailsRouteProps) {
  const { projectId } = await params;

  const project = demoProjects.find((project) => project.id === projectId);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsPage activeTab="overview" project={project} />;
}
