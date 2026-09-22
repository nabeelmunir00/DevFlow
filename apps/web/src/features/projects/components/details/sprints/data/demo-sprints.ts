export interface SprintSummaryData {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  totalEstimate: number;
}

export interface TeamWorkloadMember {
  id: string;
  name: string;
  initials: string;
  assigned: number;
  capacity: number;
}

export interface PastSprint {
  id: string;
  name: string;
  dates: string;
  completedTasks: number;
  totalTasks: number;
}

export const activeSprint: SprintSummaryData = {
  id: "sprint-06",
  name: "Sprint 06",
  goal: "Ship project navigation and finish the review workflow.",
  startDate: "Sep 14",
  endDate: "Sep 25",
  totalEstimate: 16,
};

export const teamWorkload: TeamWorkloadMember[] = [
  {
    id: "member-1",
    name: "Nabeel Munir",
    initials: "NM",
    assigned: 5,
    capacity: 6,
  },
  {
    id: "member-2",
    name: "Sara Ali",
    initials: "SA",
    assigned: 7,
    capacity: 6,
  },
  {
    id: "member-3",
    name: "Ahmed Hassan",
    initials: "AH",
    assigned: 4,
    capacity: 6,
  },
  {
    id: "member-4",
    name: "Maya Chen",
    initials: "MC",
    assigned: 5,
    capacity: 6,
  },
  {
    id: "member-5",
    name: "Omar Khan",
    initials: "OK",
    assigned: 3,
    capacity: 6,
  },
  {
    id: "member-6",
    name: "Leo Park",
    initials: "LP",
    assigned: 2,
    capacity: 6,
  },
];

export const pastSprints: PastSprint[] = [
  {
    id: "sprint-05",
    name: "Sprint 05",
    dates: "Aug 31 – Sep 13",
    completedTasks: 14,
    totalTasks: 16,
  },
  {
    id: "sprint-04",
    name: "Sprint 04",
    dates: "Aug 17 – Aug 30",
    completedTasks: 12,
    totalTasks: 14,
  },
];
