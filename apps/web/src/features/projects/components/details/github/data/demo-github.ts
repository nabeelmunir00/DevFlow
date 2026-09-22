import type { ProjectGitHubData } from "../../../../types/github";

export const demoProjectGitHub: ProjectGitHubData = {
  connectionStatus: "CONNECTED",
  lastSyncedAt: "2 min ago",

  repository: {
    id: "repo-1",
    name: "web",
    fullName: "devflow/web",
    description: "Frontend application for DevFlow",
    htmlUrl: "https://github.com/devflow/web",
    defaultBranch: "main",
    isPrivate: true,
    isArchived: false,
  },

  stats: {
    openPullRequests: 4,
    linkedIssues: 3,
    commitsThisWeek: 12,
  },

  pullRequestCounts: {
    open: 4,
    merged: 12,
    closed: 3,
  },

  pullRequests: [
    {
      id: "pr-314",
      number: 314,
      title: "Enforce organization scope",
      state: "OPEN",
      isDraft: false,
      author: {
        login: "nabeel",
        name: "Nabeel Munir",
        initials: "NM",
      },
      headRef: "feat/org-scope",
      baseRef: "main",
      reviewStatus: "NEEDS_REVIEW",
      additions: 128,
      deletions: 24,
      changedFiles: 6,
      commitsCount: 4,
      linkedTask: {
        id: "task-121",
        key: "DF-121",
        title: "Organization scope",
      },
      htmlUrl: "https://github.com/devflow/web/pull/314",
      updatedAt: "12 min ago",
    },

    {
      id: "pr-318",
      number: 318,
      title: "Fix invitation token expiry",
      state: "OPEN",
      isDraft: false,
      author: {
        login: "sara",
        name: "Sara Ali",
        initials: "SA",
      },
      headRef: "fix/invite-expiry",
      baseRef: "main",
      reviewStatus: "APPROVED",
      additions: 42,
      deletions: 18,
      changedFiles: 3,
      commitsCount: 2,
      linkedTask: {
        id: "task-128",
        key: "DF-128",
        title: "Resolve invite token expiry",
      },
      htmlUrl: "https://github.com/devflow/web/pull/318",
      updatedAt: "28 min ago",
    },

    {
      id: "pr-320",
      number: 320,
      title: "Responsive task drawer",
      state: "OPEN",
      isDraft: false,
      author: {
        login: "ahmed",
        name: "Ahmed Hassan",
        initials: "AH",
      },
      headRef: "feat/task-drawer",
      baseRef: "main",
      reviewStatus: "CHANGES_REQUESTED",
      additions: 186,
      deletions: 35,
      changedFiles: 8,
      commitsCount: 5,
      linkedTask: {
        id: "task-118",
        key: "DF-118",
        title: "Task detail panel",
      },
      htmlUrl: "https://github.com/devflow/web/pull/320",
      updatedAt: "1 hour ago",
    },

    {
      id: "pr-322",
      number: 322,
      title: "Add task loading states",
      state: "OPEN",
      isDraft: true,
      author: {
        login: "maya",
        name: "Maya Chen",
        initials: "MC",
      },
      headRef: "feat/loading-states",
      baseRef: "main",
      reviewStatus: "DRAFT",
      additions: 64,
      deletions: 22,
      changedFiles: 4,
      commitsCount: 2,
      linkedTask: {
        id: "task-134",
        key: "DF-134",
        title: "Add loading states",
      },
      htmlUrl: "https://github.com/devflow/web/pull/322",
      updatedAt: "2 hours ago",
    },
    // MERGED PULL REQUESTS
    {
      id: "pr-309",
      number: 309,
      title: "Add workspace permissions",
      state: "MERGED",
      isDraft: false,

      author: {
        login: "sara",
        name: "Sara Ali",
        initials: "SA",
      },

      headRef: "feat/workspace-permissions",
      baseRef: "main",

      reviewStatus: "APPROVED",

      additions: 214,
      deletions: 48,
      changedFiles: 9,
      commitsCount: 6,

      linkedTask: {
        id: "task-112",
        key: "DF-112",
        title: "Workspace permissions",
      },

      htmlUrl: "https://github.com/devflow/web/pull/309",
      updatedAt: "Yesterday",
    },
    {
      id: "pr-305",
      number: 305,
      title: "Implement responsive navigation",
      state: "MERGED",
      isDraft: false,

      author: {
        login: "nabeel",
        name: "Nabeel Munir",
        initials: "NM",
      },

      headRef: "feat/responsive-navbar",
      baseRef: "main",

      reviewStatus: "APPROVED",

      additions: 168,
      deletions: 37,
      changedFiles: 7,
      commitsCount: 5,

      linkedTask: {
        id: "task-109",
        key: "DF-109",
        title: "Responsive navbar",
      },

      htmlUrl: "https://github.com/devflow/web/pull/305",
      updatedAt: "2 days ago",
    },
    {
      id: "pr-301",
      number: 301,
      title: "Add analytics event tracking",
      state: "MERGED",
      isDraft: false,

      author: {
        login: "ahmed",
        name: "Ahmed Hassan",
        initials: "AH",
      },

      headRef: "feat/analytics-events",
      baseRef: "main",

      reviewStatus: "APPROVED",

      additions: 96,
      deletions: 21,
      changedFiles: 5,
      commitsCount: 3,

      linkedTask: {
        id: "task-119",
        key: "DF-119",
        title: "Analytics events",
      },

      htmlUrl: "https://github.com/devflow/web/pull/301",
      updatedAt: "4 days ago",
    },

    // CLOSED PULL REQUESTS
    {
      id: "pr-297",
      number: 297,
      title: "Experiment with legacy task sidebar",
      state: "CLOSED",
      isDraft: false,

      author: {
        login: "maya",
        name: "Maya Chen",
        initials: "MC",
      },

      headRef: "experiment/task-sidebar",
      baseRef: "main",

      reviewStatus: "CHANGES_REQUESTED",

      additions: 143,
      deletions: 62,
      changedFiles: 8,
      commitsCount: 4,

      linkedTask: null,

      htmlUrl: "https://github.com/devflow/web/pull/297",
      updatedAt: "5 days ago",
    },
    {
      id: "pr-294",
      number: 294,
      title: "Replace legacy organization selector",
      state: "CLOSED",
      isDraft: false,

      author: {
        login: "nabeel",
        name: "Nabeel Munir",
        initials: "NM",
      },

      headRef: "refactor/org-selector",
      baseRef: "main",

      reviewStatus: "CHANGES_REQUESTED",

      additions: 81,
      deletions: 104,
      changedFiles: 6,
      commitsCount: 3,

      linkedTask: {
        id: "task-121",
        key: "DF-121",
        title: "Organization switcher",
      },

      htmlUrl: "https://github.com/devflow/web/pull/294",
      updatedAt: "1 week ago",
    },
    {
      id: "pr-288",
      number: 288,
      title: "Initial notification panel prototype",
      state: "CLOSED",
      isDraft: false,

      author: {
        login: "sara",
        name: "Sara Ali",
        initials: "SA",
      },

      headRef: "prototype/notifications",
      baseRef: "main",

      reviewStatus: "NEEDS_REVIEW",

      additions: 122,
      deletions: 15,
      changedFiles: 5,
      commitsCount: 2,

      linkedTask: null,

      htmlUrl: "https://github.com/devflow/web/pull/288",
      updatedAt: "2 weeks ago",
    },
  ],

  linkedIssues: [
    {
      id: "issue-208",
      number: 208,
      title: "Invitation expires too early",
      state: "OPEN",
      htmlUrl: "https://github.com/devflow/web/issues/208",
      linkedTask: {
        id: "task-128",
        key: "DF-128",
        title: "Resolve invite token expiry",
      },
    },
    {
      id: "issue-211",
      number: 211,
      title: "Focus escapes task drawer",
      state: "OPEN",
      htmlUrl: "https://github.com/devflow/web/issues/211",
      linkedTask: {
        id: "task-118",
        key: "DF-118",
        title: "Task detail panel",
      },
    },
    {
      id: "issue-215",
      number: 215,
      title: "Missing loading feedback",
      state: "OPEN",
      htmlUrl: "https://github.com/devflow/web/issues/215",
      linkedTask: {
        id: "task-134",
        key: "DF-134",
        title: "Add loading states",
      },
    },
  ],

  recentActivity: [
    {
      id: "activity-1",
      type: "PR_APPROVED",
      actor: {
        login: "sara",
        name: "Sara Ali",
        initials: "SA",
      },
      pullRequestNumber: 318,
      message: "Sara Ali approved #318",
      detail: "Looks good! Ready to merge.",
      createdAt: "28 min ago",
    },
    {
      id: "activity-2",
      type: "PR_COMMITS_PUSHED",
      actor: {
        login: "nabeel",
        name: "Nabeel Munir",
        initials: "NM",
      },
      pullRequestNumber: 314,
      message: "Nabeel Munir pushed 2 commits to #314",
      detail: "a84b9f2 · c73e812",
      createdAt: "42 min ago",
    },
    {
      id: "activity-3",
      type: "PR_CHANGES_REQUESTED",
      actor: {
        login: "ahmed",
        name: "Ahmed Hassan",
        initials: "AH",
      },
      pullRequestNumber: 320,
      message: "Ahmed Hassan requested changes on #320",
      detail: "Please address the comments about mobile responsiveness.",
      createdAt: "1 hour ago",
    },
  ],
};
