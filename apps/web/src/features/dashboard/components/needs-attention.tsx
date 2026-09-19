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

function getStatusLabel(status: AttentionStatus) {
  switch (status) {
    case "BLOCKED":
      return "Blocked";

    case "OVERDUE":
      return "Overdue";

    case "REVIEW":
      return "Review";
  }
}

function getStatusClassName(status: AttentionStatus) {
  switch (status) {
    case "BLOCKED":
      return "border-destructive/30 bg-destructive/10 text-destructive";

    case "OVERDUE":
      return "border-warning/30 bg-warning/10 text-warning";

    case "REVIEW":
      return "border-info/30 bg-info/10 text-info";
  }
}

export function NeedsAttention({
  slug,
  items = demoItems,
}: NeedsAttentionProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border py-0 shadow-none">
      <DashboardPanelHeader
        title="Needs attention"
        actionLabel="View all"
        href={`/workspace/${slug}/tasks`}
      />

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="h-9 w-20 px-3 text-xs font-normal text-muted-foreground">
                ID
              </TableHead>

              <TableHead className="h-9 min-w-40 px-2 text-xs font-normal text-muted-foreground">
                Title
              </TableHead>

              <TableHead className="h-9 w-24 px-2 text-xs font-normal text-muted-foreground">
                Status
              </TableHead>

              <TableHead className="h-9 w-10 px-2">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="h-11 border-border">
                <TableCell className="px-3 py-0 text-xs text-muted-foreground">
                  {item.id}
                </TableCell>

                <TableCell className="max-w-52 px-2 py-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <Badge
                    variant="outline"
                    className={`rounded-sm px-2 py-0 text-[11px] font-medium ${getStatusClassName(
                      item.status,
                    )}`}
                  >
                    {getStatusLabel(item.status)}
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
                          className="size-7"
                        />
                      }
                    >
                      <Icon
                        icon="solar:menu-dots-bold"
                        className="size-4 text-muted-foreground"
                      />

                      <span className="sr-only">Task actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View task</DropdownMenuItem>

                      <DropdownMenuItem>Edit task</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
