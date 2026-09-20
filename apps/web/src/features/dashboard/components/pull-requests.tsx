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

type PullRequestStatus = "READY" | "REVIEW" | "CHANGES_REQUESTED";

export interface PullRequest {
  id: number;
  title: string;
  status: PullRequestStatus;
}

interface PullRequestsProps {
  pullRequests?: PullRequest[];
}

const demoPullRequests: PullRequest[] = [
  {
    id: 142,
    title: "Organization switcher",
    status: "READY",
  },
  {
    id: 138,
    title: "Invitation flow",
    status: "REVIEW",
  },
  {
    id: 134,
    title: "Workspace loading state",
    status: "CHANGES_REQUESTED",
  },
];

const statusStyles: Record<
  PullRequestStatus,
  {
    label: string;
    badge: string;
    dot: string;
  }
> = {
  READY: {
    label: "Ready",
    badge: "border-success/30 bg-success/10 text-success",
    dot: "bg-success",
  },

  REVIEW: {
    label: "In review",
    badge: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
  },

  CHANGES_REQUESTED: {
    label: "Changes",
    badge: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
  },
};

export function PullRequests({
  pullRequests = demoPullRequests,
}: PullRequestsProps) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      <DashboardPanelHeader
        title="Pull requests"
        actionLabel="View all"
        href={`/workspace/github`}
      />

      <CardContent className="p-0">
        <Table aria-label="Pull requests">
          <TableHeader>
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="h-9 w-16 px-4 text-xs font-normal text-muted-foreground">
                #
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
            {pullRequests.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No open pull requests.
                </TableCell>
              </TableRow>
            ) : (
              pullRequests.map((pullRequest) => {
                const status = statusStyles[pullRequest.status];

                return (
                  <TableRow
                    key={pullRequest.id}
                    className="h-10 border-border transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="px-4 py-0">
                      <span className="text-xs tabular-nums text-muted-foreground">
                        #{pullRequest.id}
                      </span>
                    </TableCell>

                    <TableCell className="min-w-0 px-2 py-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <Icon
                          icon="mdi:source-pull"
                          className="size-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />

                        <span
                          className="truncate text-sm font-medium text-foreground"
                          title={pullRequest.title}
                        >
                          {pullRequest.title}
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

                          <span className="sr-only">
                            Actions for pull request #{pullRequest.id}
                          </span>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="min-w-40">
                          <DropdownMenuItem>
                            <Icon
                              icon="mdi:source-pull"
                              className="size-4"
                              aria-hidden="true"
                            />
                            Open pull request
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Icon
                              icon="mdi:github"
                              className="size-4"
                              aria-hidden="true"
                            />
                            View repository
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
