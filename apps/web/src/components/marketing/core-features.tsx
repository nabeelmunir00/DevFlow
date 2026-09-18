import {
  BarChart3,
  FolderKanban,
  GitBranch,
  MessageSquare,
  RefreshCcw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Project management",
    description:
      "Plan projects, organize tasks, set priorities, and keep ownership clear.",
    icon: FolderKanban,
    iconClassName: "text-info",
  },
  {
    title: "GitHub integration",
    description:
      "Connect repositories, pull requests, commits, and development activity.",
    icon: GitBranch,
    iconClassName: "text-primary",
  },
  {
    title: "AI engineering assistant",
    description:
      "Get contextual AI assistance across your projects and development workflow.",
    icon: Sparkles,
    iconClassName: "text-warning",
  },
  {
    title: "Sprint planning",
    description:
      "Organize backlogs, plan iterations, and keep your team focused on delivery.",
    icon: RefreshCcw,
    iconClassName: "text-success",
  },
  {
    title: "Team collaboration",
    description:
      "Keep discussions, project updates, and shared context in one workspace.",
    icon: MessageSquare,
    iconClassName: "text-info",
  },
  {
    title: "Analytics",
    description:
      "Track project progress, delivery trends, and engineering activity.",
    icon: BarChart3,
    iconClassName: "text-primary",
  },
];

export function CoreFeatures() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
        {/* Section heading */}
        <div className="max-w-2xl">
          <p className="font-medium text-primary">One workspace</p>

          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything your team needs to ship software
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            From planning to delivery, DevFlow keeps your engineering workflow
            organized and connected in one place.
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  iconClassName,
}: FeatureCardProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-secondary">
          <Icon
            className={cn("size-5", iconClassName)}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="font-heading text-base">{title}</CardTitle>

        <CardDescription className="mt-2 leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
