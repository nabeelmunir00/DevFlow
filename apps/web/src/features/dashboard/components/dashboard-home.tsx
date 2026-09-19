import { DashboardHeader } from "./dashboard-header";
import { WorkspaceMetrics } from "./workspace-metrics";

export function DashboardHome() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full px-7 py-5">
        <div className="space-y-10">
          <DashboardHeader />

          <WorkspaceMetrics />
        </div>
      </div>
    </div>
  );
}
