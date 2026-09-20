import { DashboardHome } from "@/features/dashboard/components/dashboard-home";
import { ProjectsPage } from "@/features/projects/components/projects-page";

interface WorkspaceViewPageProps {
  params: Promise<{
    slug: string;
    view?: string[];
  }>;
}

export default async function WorkspaceViewPage({
  params,
}: WorkspaceViewPageProps) {
  const { slug, view = [] } = await params;

  const section = view[0] ?? "home";

  if (section === "home") {
    return <DashboardHome slug={slug} />;
  }

  if (section === "projects") {
    return <ProjectsPage slug={slug} />;
  }

  return null;
}
