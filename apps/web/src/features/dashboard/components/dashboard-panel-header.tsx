import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";

interface DashboardPanelHeaderProps {
  title: string;
  actionLabel?: string;
  href?: string;
}

export function DashboardPanelHeader({
  title,
  actionLabel,
  href,
}: DashboardPanelHeaderProps) {
  return (
    <div className="flex h-11 items-center justify-between border-b border-border px-4">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>

      {actionLabel && href ? (
        <Button
          nativeButton={false}
          render={<Link href={href} />}
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-sm text-primary font-normal  hover:text-primary"
        >
          {actionLabel}

          <Icon icon="solar:arrow-right-linear" className="size-5" />
        </Button>
      ) : null}
    </div>
  );
}
