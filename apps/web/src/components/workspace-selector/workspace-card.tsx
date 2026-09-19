import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import type { Organization } from "@/features/organizations/types/organization";

interface WorkspaceCardProps {
  organization: Organization;
}

const workspaceColors = [
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-cyan-600",
  "bg-fuchsia-500",
  "bg-lime-600",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-blue-500",
];

function getWorkspaceColor(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return workspaceColors[Math.abs(hash) % workspaceColors.length];
}

function formatRole(role: Organization["role"]) {
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function WorkspaceCard({ organization }: WorkspaceCardProps) {
  const initials =
    organization.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "W";

  const backgroundColor = getWorkspaceColor(organization.id);

  return (
    <Card className="group overflow-hidden py-0 shadow-none transition-colors hover:bg-muted/30">
      <CardContent className="flex min-h-24 items-center gap-5 p-5">
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white shadow-sm ${backgroundColor}`}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-heading text-base font-medium text-foreground">
            {organization.name}
          </h2>

          <div className=" flex items-center gap-2 text-sm text-muted-foreground">
            <p className=" text-sm text-muted-foreground">
              {organization.memberCount}{" "}
              {organization.memberCount === 1 ? "member" : "members"}
              <span className="mx-1.5">·</span>
              {formatRole(organization.role)}
            </p>
          </div>
        </div>

        <Link
          href={`/workspace/${organization.slug}`}
          className="flex shrink-0 items-center gap-3 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <span className="hidden sm:inline">Open workspace</span>

          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
