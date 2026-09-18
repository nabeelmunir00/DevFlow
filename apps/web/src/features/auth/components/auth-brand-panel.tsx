import { AuthTaskCard } from "./auth-task-card";

export function AuthBrandPanel() {
  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col px-10 py-16">
      <div className="mt-8">
        <h1 className="max-w-md font-heading text-4xl font-semibold tracking-tight text-foreground">
          Welcome back to
          <br />
          your workspace.
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          Pick up where you left off. Keep your projects, tasks, and team moving
          forward.
        </p>
      </div>

      <div className="relative mt-12 min-h-72">
        <AuthTaskCard
          project="API Platform"
          initials="AP"
          title="Implement rate limiting"
          status="In progress"
          progress="3/5"
          comments={2}
          members={["AH", "+1"]}
          variant="info"
          className="absolute left-0 top-0 z-10 w-4/5"
        />

        <AuthTaskCard
          project="Design System"
          initials="DS"
          title="Update component library"
          status="In review"
          progress="8/10"
          comments={4}
          members={["SK", "AR", "+2"]}
          variant="warning"
          className="absolute bottom-0 right-0 z-20 w-4/5"
        />
      </div>

      <div className="mt-auto pt-12">
        <div className="mb-5 h-0.5 w-12 rounded-full bg-primary" />

        <p className="font-medium text-foreground">
          Better tools. Happier teams.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          DevFlow helps you build what&apos;s next.
        </p>
      </div>
    </div>
  );
}
