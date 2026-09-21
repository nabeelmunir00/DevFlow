import { demoProjects } from "../components/data/demo-projects";
import type { ProjectDetails } from "./project";

export const demoProjectDetails: ProjectDetails[] = demoProjects.map(
  (project) => {
    const owner = project.members[0];
    const lead = project.members[1] ?? project.members[0];

    if (!owner || !lead) {
      throw new Error(`Project ${project.id} requires at least one member.`);
    }

    const member3 = project.members[2] ?? owner;
    const member4 = project.members[3] ?? lead;

    const totalTasks = project.openTasks + 24;

    const completedTasks = Math.round((project.progress / 100) * totalTasks);

    return {
      ...project,

      /* =====================================================
         PROJECT DETAILS
      ====================================================== */

      goal: `Build and deliver ${project.name} with a reliable, scalable, and production-ready workflow.`,

      startDate: "Sep 01, 2026",
      endDate: project.dueDate,

      owner,
      lead,

      createdAt: "Aug 28, 2026",
      updatedAt: "Sep 21, 2026",

      completedTasks,
      totalTasks,

      repositoryUrl: `https://github.com/${project.repository}`,
      defaultBranch: "main",

      /* =====================================================
         TASKS / BOARD
      ====================================================== */

      recentTasks: [
        /* =========================
           TODO
        ========================== */

        {
          id: `${project.key}-118`,
          title: "Task detail panel",
          description:
            "Build the task detail panel with comments, attachments and activity timeline.",
          status: "TODO",
          priority: "MEDIUM",
          dueDate: "Sep 20",
          assignee: member3,

          label: "ui",

          completedSubtasks: 0,
          totalSubtasks: 5,

          comments: 3,
          attachments: 1,
        },

        {
          id: `${project.key}-137`,
          title: "Set up error tracking",
          description:
            "Integrate Sentry for frontend error tracking and alerts.",
          status: "TODO",
          priority: "LOW",
          dueDate: "Sep 24",
          assignee: lead,

          label: "infra",

          completedSubtasks: 0,
          totalSubtasks: 3,

          comments: 1,
          attachments: 0,
        },

        /* =========================
           IN PROGRESS
        ========================== */

        {
          id: `${project.key}-121`,
          title: "Organization switcher",
          description:
            "Add organization switcher to quickly change between workspaces.",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: "Sep 25",
          assignee: owner,

          label: "settings",

          completedSubtasks: 3,
          totalSubtasks: 5,

          comments: 2,
          attachments: 1,

          pullRequest: 314,
        },

        {
          id: `${project.key}-134`,
          title: "Add loading states",
          description: "Add skeleton loading states across key pages.",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueDate: "Sep 22",
          assignee: member4,

          label: "ui",

          completedSubtasks: 2,
          totalSubtasks: 4,

          comments: 1,
          attachments: 0,

          pullRequest: 320,
        },

        /* =========================
           IN REVIEW
        ========================== */

        {
          id: `${project.key}-128`,
          title: "Resolve invite token expiry",
          description:
            "Handle expired invite tokens with a better error message and retry flow.",
          status: "IN_REVIEW",
          priority: "HIGH",
          dueDate: "Sep 25",
          assignee: lead,

          label: "auth",

          completedSubtasks: 4,
          totalSubtasks: 5,

          comments: 2,
          attachments: 0,

          pullRequest: 318,
        },

        {
          id: `${project.key}-132`,
          title: "Improve onboarding copy",
          description: "Refine onboarding text based on user feedback.",
          status: "IN_REVIEW",
          priority: "MEDIUM",
          dueDate: "Sep 23",
          assignee: member4,

          label: "ux",

          completedSubtasks: 2,
          totalSubtasks: 3,

          comments: 4,
          attachments: 1,
        },

        /* =========================
           DONE
        ========================== */

        {
          id: `${project.key}-109`,
          title: "Responsive navbar",
          description: "Make navbar responsive for mobile and tablet screens.",
          status: "DONE",
          priority: "MEDIUM",
          dueDate: "Sep 16",
          assignee: lead,

          label: "ui",

          completedSubtasks: 5,
          totalSubtasks: 5,

          comments: 3,
          attachments: 0,

          pullRequest: 301,
        },

        {
          id: `${project.key}-112`,
          title: "Workspace permissions",
          description: "Implement role-based access controls for workspaces.",
          status: "DONE",
          priority: "HIGH",
          dueDate: "Sep 18",
          assignee: member3,

          label: "security",

          completedSubtasks: 6,
          totalSubtasks: 6,

          comments: 2,
          attachments: 1,

          pullRequest: 307,
        },

        {
          id: `${project.key}-119`,
          title: "Analytics events",
          description: "Track key user events in Mixpanel.",
          status: "DONE",
          priority: "LOW",
          dueDate: "Sep 19",
          assignee: member4,

          label: "analytics",

          completedSubtasks: 4,
          totalSubtasks: 4,

          comments: 1,
          attachments: 0,

          pullRequest: 309,
        },
      ],

      /* =====================================================
         RECENT ACTIVITY
      ====================================================== */

      recentActivity: [
        {
          id: `${project.id}-activity-1`,
          message: `commented on ${project.key}-121`,
          actor: lead,
          createdAt: "12 min ago",
        },

        {
          id: `${project.id}-activity-2`,
          message: "#314 Enforce organization scope was merged",
          actor: member3,
          createdAt: "1 hour ago",
        },

        {
          id: `${project.id}-activity-3`,
          message: `moved ${project.key}-118 to In progress`,
          actor: member3,
          createdAt: "1 hour ago",
        },

        {
          id: `${project.id}-activity-4`,
          message: `pushed 3 commits to ${project.repository}`,
          actor: member4,
          createdAt: "3 hours ago",
        },

        {
          id: `${project.id}-activity-5`,
          message: `created ${project.key}-134`,
          actor: owner,
          createdAt: "4 hours ago",
        },
      ],

      /* =====================================================
         UPCOMING DEADLINES
      ====================================================== */

      upcomingDeadlines: [
        {
          id: `${project.id}-deadline-1`,
          taskKey: `${project.key}-121`,
          title: "Organization switcher",
          date: "Today",
          status: "IN_PROGRESS",
        },

        {
          id: `${project.id}-deadline-2`,
          taskKey: `${project.key}-128`,
          title: "Resolve invite token expiry",
          date: "Today",
          status: "IN_REVIEW",
        },

        {
          id: `${project.id}-deadline-3`,
          taskKey: `${project.key}-118`,
          title: "Task detail panel",
          date: "Sep 20",
          status: "TODO",
        },
      ],
    };
  },
);
