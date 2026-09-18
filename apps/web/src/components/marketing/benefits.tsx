import {
  FolderKanban,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const benefits = [
  {
    title: "Plan projects",
    description: "Organize work, set priorities, and keep everything on track.",
    icon: FolderKanban,
    iconClassName: "text-info",
  },
  {
    title: "Move work forward",
    description: "Turn ideas into progress with clear tasks and ownership.",
    icon: TrendingUp,
    iconClassName: "text-success",
  },
  {
    title: "Stay in sync",
    description: "Keep conversations, files, and updates together.",
    icon: UsersRound,
    iconClassName: "text-primary",
  },
];

export function Benefits() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid border-y border-border lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Benefit
              key={benefit.title}
              {...benefit}
              className={cn(index > 0 && "lg:border-l lg:border-border")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface BenefitProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  className?: string;
}

function Benefit({
  title,
  description,
  icon: Icon,
  iconClassName,
  className,
}: BenefitProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-6 py-8 lg:px-8 first:lg:pl-0 last:lg:pr-0",
        className,
      )}
    >
      <Card className="size-14 shrink-0 rounded-lg py-0 shadow-none">
        <CardContent className="flex size-full items-center justify-center p-0">
          <Icon
            className={cn("size-7", iconClassName)}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </CardContent>
      </Card>

      <div className="pt-1">
        <CardTitle className="font-heading text-base">{title}</CardTitle>

        <CardDescription className="mt-2 max-w-sm text-sm leading-relaxed">
          {description}
        </CardDescription>
      </div>
    </div>
  );
}
