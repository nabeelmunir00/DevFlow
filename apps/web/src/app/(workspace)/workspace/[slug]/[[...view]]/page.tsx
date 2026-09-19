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

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-6 py-5">
        <p className="text-sm text-muted-foreground">slug: {slug}</p>

        <p className="text-sm text-muted-foreground">section: {section}</p>
      </div>
    </div>
  );
}
