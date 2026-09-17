import { CheckSquare2, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AuthShowcaseProps {
  mode?: "sign-in" | "sign-up";
}

export function AuthShowcase({ mode = "sign-in" }: AuthShowcaseProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="w-full max-w-lg">
      {/* Heading */}
      <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-foreground">
        {isSignIn ? (
          <>
            Welcome back to
            <br />
            your workspace.
          </>
        ) : (
          <>
            Build better.
            <br />
            Ship together.
          </>
        )}
      </h1>

      {/* Description */}
      <p className="mt-5 max-w-md text-lg leading-7 text-muted-foreground">
        {isSignIn
          ? "Pick up where you left off. Keep your projects, tasks, and team moving forward."
          : "Plan projects, collaborate with your team, and keep development moving forward."}
      </p>

      {/* Cards */}
      <div className="relative mt-12 pb-28">
        {/* Card 1 */}
        <Card className="w-[82%] gap-0 rounded-xl border-border bg-card py-0 shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-purple text-xs font-bold text-purple-foreground">
                  AP
                </div>

                <span className="truncate text-sm font-medium text-muted-foreground">
                  API Platform
                </span>
              </div>

              <Badge
                variant="outline"
                className="h-8 shrink-0 gap-2 rounded-full border-info/20 bg-info/10 px-3 text-xs font-medium text-info"
              >
                <span className="size-2 rounded-full bg-info" />
                In progress
              </Badge>
            </div>

            <p className="mt-4 text-base font-semibold tracking-tight text-card-foreground">
              Implement rate limiting
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckSquare2 className="size-4" strokeWidth={1.7} />
                  3/5
                </span>

                <span className="flex items-center gap-2">
                  <MessageSquare className="size-4" strokeWidth={1.7} />2
                </span>
              </div>

              <div className="flex -space-x-2">
                <ShowcaseAvatar initials="AH" />
                <ShowcaseAvatar initials="+1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="absolute left-[18%] top-32 z-10 w-[82%] gap-0 rounded-xl border-border bg-card py-0 shadow-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-success text-xs font-bold text-success-foreground">
                  DS
                </div>

                <span className="truncate text-sm font-medium text-muted-foreground">
                  Design System
                </span>
              </div>

              <Badge
                variant="outline"
                className="h-8 shrink-0 gap-2 rounded-full border-warning/20 bg-warning/10 px-3 text-xs font-medium text-warning"
              >
                <span className="size-2 rounded-full bg-warning" />
                In review
              </Badge>
            </div>

            <p className="mt-4 text-base font-semibold tracking-tight text-card-foreground">
              Update component library
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckSquare2 className="size-4" strokeWidth={1.7} />
                  8/10
                </span>

                <span className="flex items-center gap-2">
                  <MessageSquare className="size-4" strokeWidth={1.7} />4
                </span>
              </div>

              <div className="flex -space-x-2">
                <ShowcaseAvatar initials="SK" />
                <ShowcaseAvatar initials="AR" />
                <ShowcaseAvatar initials="+2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer text */}
      <div className="mt-14">
        <div className="mb-4 h-0.5 w-12 rounded-full bg-primary" />

        <p className="text-base font-medium text-foreground">
          Better tools. Happier teams.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          DevFlow helps you build what&apos;s next.
        </p>
      </div>
    </div>
  );
}

function ShowcaseAvatar({ initials }: { initials: string }) {
  return (
    <Avatar className="size-9 border-2 border-card">
      <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
