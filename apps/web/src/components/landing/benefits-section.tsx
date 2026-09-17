import { Folder, MoveUpRight, Users } from "lucide-react";

const benefits = [
  {
    icon: Folder,
    title: "Plan projects",
    description: "Organize work, set priorities, and keep things on track.",
    iconClass: "text-info",
  },
  {
    icon: MoveUpRight,
    title: "Move work forward",
    description: "Turn ideas into progress with clear tasks and ownership.",
    iconClass: "text-success",
  },
  {
    icon: Users,
    title: "Stay in sync",
    description: "Keep conversations, files, and updates together.",
    iconClass: "text-primary",
  },
];

export function BenefitsSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
      <div className="grid border-y border-border md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, description, iconClass }) => (
          <div
            key={title}
            className="flex gap-5 border-b border-border py-8 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
              <Icon className={`size-6 ${iconClass}`} strokeWidth={1.8} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">{title}</h3>

              <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
