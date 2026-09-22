"use client";

import { Icon } from "@iconify/react";
import {
  ExternalLink,
  GitPullRequest,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  GitHubConnectionStatus,
  GitHubRepositorySummary,
} from "../../../types/github";

interface GitHubRepositoryHeaderProps {
  repository: GitHubRepositorySummary;
  connectionStatus: GitHubConnectionStatus;
  lastSyncedAt: string | null;

  stats: {
    openPullRequests: number;
    linkedIssues: number;
    commitsThisWeek: number;
  };

  onSync?: () => void;
}

const connectionLabels: Record<GitHubConnectionStatus, string> = {
  CONNECTED: "Connected",
  SYNCING: "Syncing",
  ERROR: "Sync error",
  DISCONNECTED: "Disconnected",
};

function ConnectionStatus({ status }: { status: GitHubConnectionStatus }) {
  const label = connectionLabels[status];

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={[
          "size-2 rounded-full",
          status === "CONNECTED" && "bg-success",
          status === "SYNCING" && "bg-warning",
          status === "ERROR" && "bg-destructive",
          status === "DISCONNECTED" && "bg-muted-foreground",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      <span
        className={
          status === "CONNECTED"
            ? "text-success"
            : status === "ERROR"
              ? "text-destructive"
              : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </div>
  );
}

export function GitHubRepositoryHeader({
  repository,
  connectionStatus,
  lastSyncedAt,
  stats,
  onSync,
}: GitHubRepositoryHeaderProps) {
  const isSyncing = connectionStatus === "SYNCING";

  return (
    <section className="border-b">
      <div className="flex min-w-0 flex-col gap-4 py-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Repository */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center">
            <Icon
              icon="mdi:github"
              className="size-11 text-foreground"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <a
                href={repository.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
              >
                {repository.fullName}
              </a>

              {repository.isPrivate && (
                <Badge variant="secondary" className="gap-1">
                  <Icon
                    icon="lucide:lock"
                    className="size-3"
                    aria-hidden="true"
                  />
                  Private
                </Badge>
              )}

              {repository.isArchived && (
                <Badge variant="outline">Archived</Badge>
              )}
            </div>

            {repository.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {repository.description}
              </p>
            )}
          </div>
        </div>

        {/* Repository actions */}
        <div className="flex min-w-0 flex-wrap items-center gap-3 lg:justify-end">
          <Button variant="secondary" size="sm" className="gap-2">
            <Icon
              icon="lucide:git-branch"
              className="size-4"
              aria-hidden="true"
            />
            {repository.defaultBranch}
            <Icon
              icon="lucide:chevron-down"
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>

          <ConnectionStatus status={connectionStatus} />

          {lastSyncedAt && (
            <span className="text-sm text-muted-foreground">
              Synced {lastSyncedAt}
            </span>
          )}

          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Sync GitHub repository"
            disabled={isSyncing}
            onClick={onSync}
          >
            <RefreshCw
              className={isSyncing ? "size-4 animate-spin" : "size-4"}
            />
          </Button>

          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={
              <a href={repository.htmlUrl} target="_blank" rel="noreferrer" />
            }
          >
            Open in GitHub
            <ExternalLink className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Repository actions"
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={
                    <a
                      href={repository.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <ExternalLink className="size-4" />
                  Open repository
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Repository stats */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-4 pl-16 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <GitPullRequest className="size-4" />
          <span>
            <span className="font-medium text-foreground">
              {stats.openPullRequests}
            </span>{" "}
            open PRs
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Icon
            icon="lucide:circle-dot"
            className="size-4"
            aria-hidden="true"
          />
          <span>
            <span className="font-medium text-foreground">
              {stats.linkedIssues}
            </span>{" "}
            linked issues
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Icon
            icon="lucide:git-commit-horizontal"
            className="size-4"
            aria-hidden="true"
          />
          <span>
            <span className="font-medium text-foreground">
              {stats.commitsThisWeek}
            </span>{" "}
            commits this week
          </span>
        </div>
      </div>
    </section>
  );
}
