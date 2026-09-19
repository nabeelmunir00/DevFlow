interface WorkspacePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-dvh bg-background p-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        {slug}
      </h1>
    </main>
  );
}
