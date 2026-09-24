import { Progress } from "@/components/ui/progress";

interface MyWorkProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export function MyWorkProgress({
  completed,
  total,
  percentage,
}: MyWorkProgressProps) {
  return (
    <div className="py-4">
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm text-foreground">
          {completed} of {total} planned tasks complete
        </p>

        <span className="text-sm font-medium text-foreground">
          {percentage}%
        </span>
      </div>

      <Progress value={percentage} className="h-2" />
    </div>
  );
}
