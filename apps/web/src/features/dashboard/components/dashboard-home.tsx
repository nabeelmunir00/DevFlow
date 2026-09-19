import { AssignedTasks } from "./assigned-tasks";
import { CurrentSprint } from "./current-sprint";
import { DashboardHeader } from "./dashboard-header";
import { NeedsAttention } from "./needs-attention";
import { PullRequests } from "./pull-requests";
import { RecentProjects } from "./recent-projects";
import { TeamActivity } from "./team-activity";
import { UpcomingDeadline } from "./upcoming-deadline";
import { WorkspaceBrief } from "./workspace-brief";
import { WorkspaceMetrics } from "./workspace-metrics";

interface DashboardHomeProps {
  slug: string;
}

export function DashboardHome({ slug }: DashboardHomeProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full px-7 py-5">
        <div className="space-y-4">
          <DashboardHeader />

          <WorkspaceMetrics />

          <WorkspaceBrief />

          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
            {/* Left column */}
            <div className="grid min-w-0 gap-4">
              <AssignedTasks slug={slug} />

              <RecentProjects slug={slug} />

              <TeamActivity slug={slug} />
            </div>

            {/* Right column */}
            <div className="grid min-w-0 gap-4">
              <CurrentSprint slug={slug} />

              <PullRequests slug={slug} />

              <NeedsAttention slug={slug} />

              <UpcomingDeadline slug={slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
