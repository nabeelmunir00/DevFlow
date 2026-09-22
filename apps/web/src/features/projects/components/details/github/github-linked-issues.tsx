"use client";

import { ExternalLink, Link2, MoreHorizontal, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { GitHubLinkedIssue } from "../../../types/github";

interface GitHubLinkedIssuesProps {
  issues: GitHubLinkedIssue[];
  onLinkIssue?: () => void;
  onUnlinkIssue?: (issueId: string) => void;
}

function IssueRow({
  issue,
  onUnlinkIssue,
}: {
  issue: GitHubLinkedIssue;
  onUnlinkIssue?: (issueId: string) => void;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 border-t px-4 py-3 first:border-t-0">
      <div className="mt-1 flex size-5 shrink-0 items-center justify-center">
        <span
          className={[
            "size-2.5 rounded-full border-2",
            issue.state === "OPEN"
              ? "border-success"
              : "border-muted-foreground",
          ].join(" ")}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start gap-2">
          <div className="min-w-0 flex-1">
            <a
              href={issue.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="line-clamp-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {issue.title}
            </a>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>#{issue.number}</span>

              <span aria-hidden="true">•</span>

              <span>linked to</span>

              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {issue.linkedTask.key}
              </Badge>
            </div>
          </div>

          <Badge
            variant="outline"
            className={
              issue.state === "OPEN"
                ? "shrink-0 border-success/30 bg-success/10 text-success"
                : "shrink-0"
            }
          >
            {issue.state === "OPEN" ? "Open" : "Closed"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for issue ${issue.number}`}
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={
                    <a href={issue.htmlUrl} target="_blank" rel="noreferrer" />
                  }
                >
                  <ExternalLink className="size-4" />
                  Open in GitHub
                </DropdownMenuItem>

                {onUnlinkIssue && (
                  <DropdownMenuItem onClick={() => onUnlinkIssue(issue.id)}>
                    <Link2 className="size-4" />
                    Unlink issue
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export function GitHubLinkedIssues({
  issues,
  onLinkIssue,
  onUnlinkIssue,
}: GitHubLinkedIssuesProps) {
  return (
    <section className="min-w-0 border-b lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Linked issues
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            GitHub issues linked to DevFlow tasks.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onLinkIssue}
        >
          <Plus className="size-4" />
          Link issue
        </Button>
      </div>

      {issues.length > 0 ? (
        <div className="border-t">
          {issues.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              onUnlinkIssue={onUnlinkIssue}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-40 flex-col items-center justify-center border-t px-4 py-8 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Link2 className="size-5 text-muted-foreground" />
          </div>

          <p className="mt-3 text-sm font-medium text-foreground">
            No linked issues
          </p>

          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Link a GitHub issue to a DevFlow task to see it here.
          </p>
        </div>
      )}
    </section>
  );
}
