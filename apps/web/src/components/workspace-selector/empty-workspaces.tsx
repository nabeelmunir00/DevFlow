import { Building2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyWorkspaces() {
  return (
    <Card className="border-dashed bg-muted/20 shadow-none">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-secondary">
          <Building2 className="size-5 text-muted-foreground" />
        </div>

        <h2 className="mt-5 font-heading text-lg font-semibold text-foreground">
          Create your first workspace
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Workspaces keep your projects, team, issues, and development activity
          organized in one place.
        </p>

        <Button className="mt-6">
          <Plus />
          Create workspace
        </Button>
      </CardContent>
    </Card>
  );
}
