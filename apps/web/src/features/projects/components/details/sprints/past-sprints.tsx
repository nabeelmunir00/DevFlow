import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PastSprint } from "./data/demo-sprints";

interface PastSprintsProps {
  sprints: PastSprint[];
}

export function PastSprints({ sprints }: PastSprintsProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Past sprints</h3>

        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto gap-1 p-0"
        >
          View all
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Completed</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sprints.map((sprint) => {
            const percentage =
              sprint.totalTasks > 0
                ? Math.round((sprint.completedTasks / sprint.totalTasks) * 100)
                : 0;

            return (
              <TableRow key={sprint.id}>
                <TableCell className="text-sm font-medium text-primary">
                  {sprint.name}
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {sprint.dates}
                </TableCell>

                <TableCell className="whitespace-nowrap text-right text-xs">
                  {sprint.completedTasks} / {sprint.totalTasks} ({percentage}%)
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
