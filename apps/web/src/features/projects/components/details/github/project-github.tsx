"use client";

import { useState } from "react";

import type { ProjectDetails } from "../../../types/project";

import {
  demoGitHubIssueOptions,
  demoGitHubTaskOptions,
  demoProjectGitHub,
} from "./data/demo-github";
import { GitHubLinkedIssues } from "./github-linked-issues";
import { GitHubPullRequests } from "./github-pull-requests";
import { GitHubRecentActivity } from "./github-recent-activity";
import { GitHubRepositoryHeader } from "./github-repository-header";
import { LinkGitHubIssueDialog } from "./link-github-issue-dialog";

interface ProjectGitHubProps {
  project: ProjectDetails;
}

export function ProjectGitHub({ project }: ProjectGitHubProps) {
  const [linkIssueOpen, setLinkIssueOpen] = useState(false);

  const github = demoProjectGitHub;

  return (
    <>
      <div className="min-w-0">
        <GitHubRepositoryHeader
          repository={github.repository}
          connectionStatus={github.connectionStatus}
          lastSyncedAt={github.lastSyncedAt}
          stats={github.stats}
        />

        <GitHubPullRequests
          project={project}
          pullRequests={github.pullRequests}
          counts={github.pullRequestCounts}
        />

        <div className="grid min-w-0 border-t lg:grid-cols-2">
          <GitHubLinkedIssues
            issues={github.linkedIssues}
            onLinkIssue={() => setLinkIssueOpen(true)}
          />

          <GitHubRecentActivity activities={github.recentActivity} />
        </div>
      </div>

      <LinkGitHubIssueDialog
        open={linkIssueOpen}
        onOpenChange={setLinkIssueOpen}
        repository={github.repository}
        issues={demoGitHubIssueOptions}
        tasks={demoGitHubTaskOptions}
        onLink={(issueId, taskId) => {
          console.log("Link GitHub issue", {
            issueId,
            taskId,
          });
        }}
      />
    </>
  );
}
