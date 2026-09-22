"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Check,
  ChevronDown,
  ExternalLink,
  GitCommitHorizontal,
  GitPullRequest,
  Search,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import type { ProjectDetails } from "../../../types/project";
import type {
  GitHubPullRequestState,
  GitHubPullRequestSummary,
  GitHubReviewStatus,
} from "../../../types/github";

interface GitHubPullRequestsProps {
  project: ProjectDetails;
  pullRequests: GitHubPullRequestSummary[];

  counts: {
    open: number;
    merged: number;
    closed: number;
  };
}

type PullRequestView = GitHubPullRequestState;

const views: {
  value: PullRequestView;
  label: string;
}[] = [
  {
    value: "OPEN",
    label: "Open",
  },
  {
    value: "MERGED",
    label: "Merged",
  },
  {
    value: "CLOSED",
    label: "Closed",
  },
];

const reviewStatusLabels: Record<GitHubReviewStatus, string> = {
  NEEDS_REVIEW: "Needs review",
  APPROVED: "Approved",
  CHANGES_REQUESTED: "Changes requested",
  DRAFT: "Draft",
};

function ReviewStatusBadge({ status }: { status: GitHubReviewStatus }) {
  const label = reviewStatusLabels[status];

  if (status === "APPROVED") {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 border-success/30 bg-success/10 text-success"
      >
        <Check className="size-3" />
        {label}
      </Badge>
    );
  }

  if (status === "CHANGES_REQUESTED") {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 border-destructive/30 bg-destructive/10 text-destructive"
      >
        <Icon
          icon="lucide:message-square-warning"
          className="size-3"
          aria-hidden="true"
        />
        {label}
      </Badge>
    );
  }

  if (status === "DRAFT") {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Icon
          icon="lucide:circle-dot-dashed"
          className="size-3"
          aria-hidden="true"
        />
        {label}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-warning/30 bg-warning/10 text-warning"
    >
      <Icon icon="lucide:eye" className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}

function PullRequestRow({
  pullRequest,
}: {
  pullRequest: GitHubPullRequestSummary;
}) {
  return (
    <div className="grid min-w-0 gap-4 border-t px-4 py-3 first:border-t-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="flex min-w-0 gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center pt-0.5 text-success">
          <GitPullRequest className="size-4" />
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <a
              href={pullRequest.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate font-medium text-foreground transition-colors hover:text-primary"
            >
              {pullRequest.title}
            </a>

            <span className="shrink-0 text-sm text-muted-foreground">
              #{pullRequest.number}
            </span>
          </div>

          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="flex min-w-0 items-center gap-1">
              <Icon
                icon="lucide:git-branch"
                className="size-3.5 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{pullRequest.headRef}</span>
            </span>

            <span aria-hidden="true">•</span>

            <Avatar className="size-4">
              {pullRequest.author.avatarUrl && (
                <AvatarImage
                  src={pullRequest.author.avatarUrl}
                  alt={pullRequest.author.name}
                />
              )}

              <AvatarFallback className="text-[0.5rem]">
                {pullRequest.author.initials}
              </AvatarFallback>
            </Avatar>

            <span>{pullRequest.author.name}</span>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 pl-11 lg:justify-end lg:pl-0">
        <ReviewStatusBadge status={pullRequest.reviewStatus} />

        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-success">
            +{pullRequest.additions}
          </span>

          <span className="font-medium text-destructive">
            -{pullRequest.deletions}
          </span>
        </div>

        <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
          <Icon
            icon="lucide:file-code-2"
            className="size-3.5"
            aria-hidden="true"
          />
          {pullRequest.changedFiles} files
          <span aria-hidden="true">•</span>
          <GitCommitHorizontal className="size-3.5" />
          {pullRequest.commitsCount} commits
        </div>

        {pullRequest.linkedTask && (
          <Badge variant="secondary">{pullRequest.linkedTask.key}</Badge>
        )}

        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {pullRequest.updatedAt}
        </span>

        <Button
          nativeButton={false}
          variant="ghost"
          size="icon-sm"
          render={
            <a
              href={pullRequest.htmlUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open pull request ${pullRequest.number} in GitHub`}
            />
          }
        >
          <ExternalLink className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function GitHubPullRequests({
  project: _project,
  pullRequests,
  counts,
}: GitHubPullRequestsProps) {
  const [view, setView] = useState<PullRequestView>("OPEN");
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState<string>("ALL");

  const authors = useMemo(() => {
    const uniqueAuthors = new Map<string, GitHubPullRequestSummary["author"]>();

    for (const pullRequest of pullRequests) {
      uniqueAuthors.set(pullRequest.author.login, pullRequest.author);
    }

    return Array.from(uniqueAuthors.values());
  }, [pullRequests]);

  const filteredPullRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pullRequests.filter((pullRequest) => {
      if (pullRequest.state !== view) {
        return false;
      }

      if (author !== "ALL" && pullRequest.author.login !== author) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        pullRequest.title.toLowerCase().includes(query) ||
        pullRequest.headRef.toLowerCase().includes(query) ||
        pullRequest.author.name.toLowerCase().includes(query) ||
        pullRequest.author.login.toLowerCase().includes(query) ||
        String(pullRequest.number).includes(query) ||
        pullRequest.linkedTask?.key.toLowerCase().includes(query)
      );
    });
  }, [author, pullRequests, search, view]);

  const countByView: Record<PullRequestView, number> = {
    OPEN: counts.open,
    MERGED: counts.merged,
    CLOSED: counts.closed,
  };

  const selectedAuthor =
    authors.find((item) => item.login === author)?.name ?? "Author";

  return (
    <section className="py-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Pull requests
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Review and track pull requests linked to this project.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pull requests..."
              className="pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="justify-between gap-2 sm:min-w-32"
                />
              }
            >
              <span className="truncate">{selectedAuthor}</span>

              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setAuthor("ALL")}>
                  All authors
                </DropdownMenuItem>

                {authors.map((item) => (
                  <DropdownMenuItem
                    key={item.login}
                    onClick={() => setAuthor(item.login)}
                  >
                    <Avatar className="size-5">
                      {item.avatarUrl && (
                        <AvatarImage src={item.avatarUrl} alt={item.name} />
                      )}

                      <AvatarFallback className="text-[0.5rem]">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>

                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center gap-1 border-b px-3">
          {views.map((item) => {
            const active = view === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setView(item.value)}
                className={[
                  "relative flex h-11 items-center gap-2 px-3 text-sm transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {item.label}

                <span className="text-xs text-muted-foreground">
                  {countByView[item.value]}
                </span>

                {active && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {filteredPullRequests.length > 0 ? (
          <div>
            {filteredPullRequests.map((pullRequest) => (
              <PullRequestRow key={pullRequest.id} pullRequest={pullRequest} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center px-4 py-8 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <GitPullRequest className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              No pull requests found
            </p>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No pull requests match the current search and filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
