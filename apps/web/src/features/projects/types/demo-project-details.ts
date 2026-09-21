import { demoProjects } from "../components/data/demo-projects";
import { ProjectDetails } from "./project";

export const demoProjectDetails: ProjectDetails[] = demoProjects.map(
  (project) => {
    const owner = project.members[0];
    const lead = project.members[1] ?? project.members[0];

    if (!owner || !lead) {
      throw new Error(`Project ${project.id} requires at least one member.`);
    }

    const totalTasks = project.openTasks + 24;

    const completedTasks = Math.round((project.progress / 100) * totalTasks);

    return {
      ...project,

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

      recentTasks: [
        {
          id: `${project.key}-121`,
          title: "Complete project workspace",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: "Today",
          assignee: owner,
        },
        {
          id: `${project.key}-118`,
          title: "Review responsive interface",
          status: "IN_REVIEW",
          priority: "MEDIUM",
          dueDate: "Tomorrow",
          assignee: lead,
        },
        {
          id: `${project.key}-110`,
          title: "Improve loading states",
          status: "TODO",
          priority: "MEDIUM",
          dueDate: "Sep 24",
          assignee: owner,
        },
      ],

      recentActivity: [
        {
          id: `${project.id}-activity-1`,
          message: "updated the project progress",
          actor: owner,
          createdAt: "12 min ago",
        },
        {
          id: `${project.id}-activity-2`,
          message: "moved a task to review",
          actor: lead,
          createdAt: "38 min ago",
        },
        {
          id: `${project.id}-activity-3`,
          message: "updated the current sprint",
          actor: owner,
          createdAt: "2 hr ago",
        },
      ],

      upcomingDeadlines: [
        {
          id: `${project.id}-deadline-1`,
          title: project.sprint,
          date: project.dueDate,
        },
        {
          id: `${project.id}-deadline-2`,
          title: "Project milestone",
          date: "Oct 01",
        },
      ],
    };
  },
);
