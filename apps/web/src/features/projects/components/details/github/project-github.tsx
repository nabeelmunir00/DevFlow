"use client";

import type { ProjectDetails } from "../../../types/project";

import { demoProjectGitHub } from "./data/demo-github";
import { GitHubRepositoryHeader } from "./github-repository-header";
import { GitHubPullRequests } from "./github-pull-requests";
import { GitHubLinkedIssues } from "./github-linked-issues";
import { GitHubRecentActivity } from "./github-recent-activity";

interface ProjectGitHubProps {
  project: ProjectDetails;
}

export function ProjectGitHub({ project }: ProjectGitHubProps) {
  const github = demoProjectGitHub;

  return (
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
        <GitHubLinkedIssues issues={github.linkedIssues} />

        <GitHubRecentActivity activities={github.recentActivity} />
      </div>
    </div>
  );
}
