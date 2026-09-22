import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type { WorkDistributionMember } from "@/features/projects/types/analytics";

interface WorkDistributionProps {
  members: WorkDistributionMember[];
}

function getProgress(member: WorkDistributionMember) {
  if (member.total === 0) {
    return 0;
  }

  return Math.round((member.completed / member.total) * 100);
}

export function WorkDistribution({ members }: WorkDistributionProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Work distribution
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Tasks completed by team member
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5">
          {members.map((member) => {
            const progress = getProgress(member);

            return (
              <div key={member.id} className="flex min-w-0 items-center gap-3">
                <Avatar className="size-8 shrink-0">
                  {member.avatarUrl && (
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                  )}

                  <AvatarFallback className="text-xs">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="truncate text-sm font-medium text-foreground">
                      {member.name}
                    </span>

                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {member.completed} / {member.total}
                    </span>
                  </div>

                  <Progress value={progress} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
