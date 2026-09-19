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
  slug: string;
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

function getStatusLabel(status: PullRequestStatus) {
  switch (status) {
    case "READY":
      return "Ready";

    case "REVIEW":
      return "In review";

    case "CHANGES_REQUESTED":
      return "Changes";
  }
}

function getStatusClassName(status: PullRequestStatus) {
  switch (status) {
    case "READY":
      return "border-success/30 bg-success/10 text-success";

    case "REVIEW":
      return "border-info/30 bg-info/10 text-info";

    case "CHANGES_REQUESTED":
      return "border-warning/30 bg-warning/10 text-warning";
  }
}

export function PullRequests({
  slug,
  pullRequests = demoPullRequests,
}: PullRequestsProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border py-0 shadow-none">
      <DashboardPanelHeader
        title="Pull requests"
        actionLabel="View all"
        href={`/workspace/${slug}/github`}
      />

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="h-9 w-14 px-3 text-xs font-normal text-muted-foreground">
                #
              </TableHead>

              <TableHead className="h-9 min-w-40 px-2 text-xs font-normal text-muted-foreground">
                Title
              </TableHead>

              <TableHead className="h-9 w-28 px-2 text-xs font-normal text-muted-foreground">
                Status
              </TableHead>

              <TableHead className="h-9 w-10 px-2">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pullRequests.map((pullRequest) => (
              <TableRow key={pullRequest.id} className="h-11 border-border">
                <TableCell className="px-3 py-0 text-xs text-muted-foreground">
                  #{pullRequest.id}
                </TableCell>

                <TableCell className="px-2 py-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon
                      icon="mdi:source-pull"
                      className="size-4 shrink-0 text-primary"
                    />

                    <span className="truncate text-sm font-medium text-foreground">
                      {pullRequest.title}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <Badge
                    variant="outline"
                    className={`rounded-sm px-2 py-0 text-[11px] font-medium ${getStatusClassName(
                      pullRequest.status,
                    )}`}
                  >
                    {getStatusLabel(pullRequest.status)}
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

                      <span className="sr-only">Pull request actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Open pull request</DropdownMenuItem>

                      <DropdownMenuItem>View repository</DropdownMenuItem>
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
