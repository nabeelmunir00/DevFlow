import type {
  ActivityMember,
  ProjectActivityGroup,
} from "../../../../types/activity";

export const demoActivityMembers: ActivityMember[] = [
  {
    id: "member-nabeel",
    name: "Nabeel Munir",
    initials: "NM",
  },
  {
    id: "member-sara",
    name: "Sara Ali",
    initials: "SA",
  },
  {
    id: "member-ahmed",
    name: "Ahmed Hassan",
    initials: "AH",
  },
  {
    id: "member-maya",
    name: "Maya Chen",
    initials: "MC",
  },
  {
    id: "member-omar",
    name: "Omar Khan",
    initials: "OK",
  },
  {
    id: "member-lee",
    name: "Lee Park",
    initials: "LP",
  },
];

export const demoProjectActivity: ProjectActivityGroup[] = [
  {
    id: "today",
    label: "Today",
    activities: [
      {
        id: "activity-1",
        category: "COMMENT",
        type: "COMMENT_ADDED",
        actor: demoActivityMembers[1],
        message: "commented on",
        target: {
          label: "DF-121",
        },
        description: "This looks good! I'll test with a few more cases.",
        createdAt: "12 min ago",
        comment: {
          id: "comment-1",
          author: demoActivityMembers[1],
          message: "This looks good! I'll test with a few more cases.",
          createdAt: "12 min ago",
        },
      },
      {
        id: "activity-2",
        category: "PULL_REQUEST",
        type: "PULL_REQUEST_REVIEW",
        actor: demoActivityMembers[2],
        message: "requested a review on",
        target: {
          label: "#318",
        },
        description: "Add validation for invite tokens",
        createdAt: "1 hour ago",
      },
      {
        id: "activity-3",
        category: "TASK",
        type: "TASK_UPDATED",
        actor: demoActivityMembers[0],
        message: "moved",
        target: {
          label: "DF-121",
        },
        createdAt: "2 hours ago",
        fromStatus: {
          label: "Todo",
          tone: "default",
        },
        toStatus: {
          label: "In progress",
          tone: "primary",
        },
      },
      {
        id: "activity-4",
        category: "PULL_REQUEST",
        type: "COMMITS_PUSHED",
        actor: demoActivityMembers[3],
        message: "pushed 3 commits to",
        target: {
          label: "devflow/web",
        },
        createdAt: "3 hours ago",
        commits: [
          "feat: add empty state",
          "fix: sidebar responsive",
          "chore: update deps",
        ],
      },
      {
        id: "activity-5",
        category: "TASK",
        type: "TASK_COMPLETED",
        actor: demoActivityMembers[4],
        message: "completed",
        target: {
          label: "DF-109",
        },
        description: "Update onboarding copy",
        createdAt: "5 hours ago",
      },
    ],
  },
  {
    id: "yesterday",
    label: "Yesterday",
    activities: [
      {
        id: "activity-6",
        category: "SPRINT",
        type: "SPRINT_STARTED",
        actor: demoActivityMembers[5],
        message: "Sprint 06 started",
        description: "Sep 14 – Sep 25",
        createdAt: "1 day ago",
      },
    ],
  },
];
