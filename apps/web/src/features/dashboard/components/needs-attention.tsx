import { Icon } from "@iconify/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DashboardPanelHeader } from "./dashboard-panel-header";

type AttentionStatus = "BLOCKED" | "OVERDUE" | "REVIEW";

export interface AttentionItem {
  id: string;
  title: string;
  status: AttentionStatus;
}

interface NeedsAttentionProps {
  slug: string;
  items?: AttentionItem[];
}

const demoItems: AttentionItem[] = [
  {
    id: "DF-128",
    title: "Invite token expiry",
    status: "BLOCKED",
  },
  {
    id: "DF-106",
    title: "Organization permission checks",
    status: "OVERDUE",
  },
  {
    id: "DF-134",
    title: "Loading states",
    status: "REVIEW",
  },
];

const statusStyles: Record<
  AttentionStatus,
  {
    label: string;
    badge: string;
    dot: string;
  }
> = {
  BLOCKED: {
    label: "Blocked",
    badge: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },

  OVERDUE: {
    label: "Overdue",
    badge: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
  },

  REVIEW: {
    label: "Review",
    badge: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
  },
};

export function NeedsAttention({
  slug,
  items = demoItems,
}: NeedsAttentionProps) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      <DashboardPanelHeader
        title="Needs attention"
        actionLabel="View all"
        href={`/workspace/${slug}/tasks`}
      />

      <CardContent className="p-0">
        <Table aria-label="Items needing attention">
          <TableHeader>
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="h-9 w-20 px-4 text-xs font-normal text-muted-foreground">
                ID
              </TableHead>

              <TableHead className="h-9 min-w-0 px-2 text-xs font-normal text-muted-foreground">
                Title
              </TableHead>

              <TableHead className="h-9 w-28 px-2 text-xs font-normal text-muted-foreground">
                Status
              </TableHead>

              <TableHead className="h-9 w-11 px-2">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  Nothing needs attention right now.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const status = statusStyles[item.status];

                return (
                  <TableRow
                    key={item.id}
                    className="h-10 border-border transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="px-4 py-0">
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {item.id}
                      </span>
                    </TableCell>

                    <TableCell className="min-w-0 px-2 py-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <Icon
                          icon="solar:danger-triangle-linear"
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />

                        <span
                          className="truncate text-sm font-medium text-foreground"
                          title={item.title}
                        >
                          {item.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-0">
                      <Badge
                        variant="outline"
                        className={`h-6 gap-1.5 rounded-full px-2 py-0 text-xs font-normal ${status.badge}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-2.5 shrink-0 rounded-full ${status.dot}`}
                        />

                        {status.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-2 py-0 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            />
                          }
                        >
                          <Icon
                            icon="solar:menu-dots-bold"
                            className="size-4"
                            aria-hidden="true"
                          />

                          <span className="sr-only">Actions for {item.id}</span>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="min-w-36">
                          <DropdownMenuItem>
                            <Icon
                              icon="solar:eye-linear"
                              className="size-4"
                              aria-hidden="true"
                            />
                            View task
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Icon
                              icon="solar:pen-linear"
                              className="size-4"
                              aria-hidden="true"
                            />
                            Edit task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
