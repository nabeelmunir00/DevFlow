import { DashboardHeader } from "./dashboard-header";

export function DashboardHome() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full px-7 py-5">
        <DashboardHeader />
      </div>
    </div>
  );
}
