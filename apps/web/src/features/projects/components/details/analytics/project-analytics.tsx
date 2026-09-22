"use client";

import { useState } from "react";

import { AnalyticsMetrics } from "./analytics-metrics";
import { AnalyticsToolbar } from "./analytics-toolbar";
import { CycleTimeChart } from "./cycle-time-chart";
import { demoProjectAnalytics } from "./data/demo-analytics";
import { MilestoneProgress } from "./milestone-progress";
import { PullRequestThroughputChart } from "./pull-request-throughput-chart";
import { SprintVelocityChart } from "./sprint-velocity-chart";
import { TaskCompletionChart } from "./task-completion-chart";
import { WorkDistribution } from "./work-distribution";

import type { ProjectDetails } from "@/features/projects/types/project";

interface ProjectAnalyticsProps {
  project: ProjectDetails;
}

export function ProjectAnalytics({ project: _project }: ProjectAnalyticsProps) {
  const analytics = demoProjectAnalytics;

  const [period, setPeriod] = useState(analytics.period.label);

  const [sprint, setSprint] = useState(analytics.sprint.name);

  const [member, setMember] = useState("All members");

  const [comparePrevious, setComparePrevious] = useState(true);

  function handleExport() {
    // Backend export will be connected later.
  }

  return (
    <div className="min-w-0 px-5 py-5">
      <AnalyticsToolbar
        period={period}
        sprint={sprint}
        member={member}
        comparePrevious={comparePrevious}
        onPeriodChange={setPeriod}
        onSprintChange={setSprint}
        onMemberChange={setMember}
        onComparePreviousChange={setComparePrevious}
        onExport={handleExport}
      />

      <div className="mt-5">
        <AnalyticsMetrics metrics={analytics.metrics} />
      </div>

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-2">
        <TaskCompletionChart data={analytics.taskCompletion} />

        <SprintVelocityChart data={analytics.sprintVelocity} />
      </div>

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-2">
        <CycleTimeChart data={analytics.cycleTime} />

        <PullRequestThroughputChart data={analytics.pullRequestThroughput} />
      </div>

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-2">
        <WorkDistribution members={analytics.workDistribution} />

        <MilestoneProgress milestones={analytics.milestones} />
      </div>
    </div>
  );
}
