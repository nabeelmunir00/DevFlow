import { DashboardHome } from "@/features/dashboard/components/dashboard-home";

interface WorkspaceViewPageProps {
  params: Promise<{
    slug: string;
    view?: string[];
  }>;
}

export default async function WorkspaceViewPage({
  params,
}: WorkspaceViewPageProps) {
  const { view = [] } = await params;

  const section = view[0] ?? "home";

  if (section === "home") {
    return <DashboardHome />;
  }

  return null;
}
