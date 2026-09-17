import { z } from 'zod';

export const TaskSuggestionSchema = z.object({
  title: z.string().min(3).max(200),

  description: z.string().min(1).max(5000),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),

  tags: z.array(z.string().min(1).max(50)).max(10),

  subtasks: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
      }),
    )
    .max(20),
});

export type TaskSuggestion = z.infer<typeof TaskSuggestionSchema>;
