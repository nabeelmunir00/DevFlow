import type { ProjectDetails } from "../../../types/project";

import { AboutProject } from "./about-project";
import { ProjectDetailsCard } from "./project-details-card";
import { ProjectProgress } from "./project-progress";
import { ProjectRepository } from "./project-repository";
import { RecentProjectActivity } from "./recent-project-activity";
import { RecentProjectTasks } from "./recent-project-tasks";
import { UpcomingDeadlines } from "./upcoming-deadlines";

interface ProjectOverviewProps {
  project: ProjectDetails;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.8fr)]">
      <div className="grid min-w-0 content-start gap-5">
        <AboutProject description={project.description} goal={project.goal} />

        <RecentProjectTasks tasks={project.recentTasks} />

        <RecentProjectActivity project={project} />
      </div>

      <div className="grid min-w-0 content-start gap-5">
        <ProjectProgress project={project} />

        <ProjectDetailsCard project={project} />

        <ProjectRepository project={project} />

        <UpcomingDeadlines project={project} />
      </div>
    </div>
  );
}
