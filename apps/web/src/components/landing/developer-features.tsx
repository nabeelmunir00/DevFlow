import { FileText, ListTodo, MessageCircle, Users } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Roles & permissions",
    description: "Keep your work secure with flexible team access.",
  },
  {
    icon: ListTodo,
    title: "Project views",
    description: "See your work your way with list, board, and timeline views.",
  },
  {
    icon: MessageCircle,
    title: "Team conversations",
    description: "Discuss work in context and move faster together.",
  },
  {
    icon: FileText,
    title: "Shared documents",
    description: "Keep important files and knowledge close to your work.",
  },
];

export function DeveloperFeatures() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Built for the way developers work
        </h2>

        <p className="mt-2 text-base text-muted-foreground">
          Everything your team needs in one place, without the clutter.
        </p>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex gap-4 lg:border-r lg:border-border lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
          >
            <Icon
              className="mt-1 size-6 shrink-0 text-primary"
              strokeWidth={1.8}
            />

            <div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
