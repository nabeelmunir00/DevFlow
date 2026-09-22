export type AnalyticsTrendDirection = "UP" | "DOWN" | "NEUTRAL";

export type AnalyticsTrendTone = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

export type AnalyticsMetricType =
  | "COMPLETION_RATE"
  | "CYCLE_TIME"
  | "PR_THROUGHPUT"
  | "REVIEW_TIME";

export interface AnalyticsTrend {
  value: number;
  direction: AnalyticsTrendDirection;
  tone: AnalyticsTrendTone;
  label: string;
}

export interface AnalyticsMetric {
  id: string;
  type: AnalyticsMetricType;
  label: string;
  value: string;
  description: string;
  trend: AnalyticsTrend;
}

export interface TaskCompletionDataPoint {
  date: string;
  completed: number;
}

export interface SprintVelocityDataPoint {
  sprint: string;
  committed: number;
  completed: number;
}

export interface CycleTimeDataPoint {
  date: string;
  days: number;
}

export interface PullRequestThroughputDataPoint {
  date: string;
  merged: number;
}

export interface WorkDistributionMember {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  completed: number;
  total: number;
}

export type MilestoneStatus = "COMPLETED" | "IN_PROGRESS" | "UPCOMING";

export interface ProjectMilestone {
  id: string;
  key: string;
  name: string;
  dueDate: string;
  tasks: number;
  completion: number;
  status: MilestoneStatus;
}

export interface ProjectAnalyticsData {
  period: {
    label: string;
    range: string;
  };

  sprint: {
    id: string;
    name: string;
    range: string;
  };

  metrics: AnalyticsMetric[];

  taskCompletion: TaskCompletionDataPoint[];

  sprintVelocity: SprintVelocityDataPoint[];

  cycleTime: CycleTimeDataPoint[];

  pullRequestThroughput: PullRequestThroughputDataPoint[];

  workDistribution: WorkDistributionMember[];

  milestones: ProjectMilestone[];
}
