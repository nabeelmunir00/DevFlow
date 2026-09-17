export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface TaskSuggestion {
  title: string;
  description: string;
  priority: TaskPriority;
  tags: string[];
  subtasks: {
    title: string;
  }[];
}
