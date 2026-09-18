import {
  ArrowUp,
  ChevronRight,
  FileCode2,
  GitPullRequest,
  ListChecks,
  ListTodo,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const toneStyles = {
  urgent: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    dot: "bg-destructive",
  },
  ready: {
    iconBg: "bg-success/10",
    iconColor: "text-success",
    dot: "bg-success",
  },
} as const;

const priorities = [
  {
    icon: ListTodo,
    title: "Complete authentication flow",
    description: "3 open tasks",
    label: "High priority",
    tone: "urgent",
  },
  {
    icon: FileCode2,
    title: "Resolve API integration issues",
    description: "2 blocking issues",
    label: "Backend",
    tone: "urgent",
  },
  {
    icon: GitPullRequest,
    title: "Review dashboard pull request",
    description: "PR #128",
    label: "Ready for review",
    tone: "ready",
  },
] satisfies {
  icon: typeof ListTodo;
  title: string;
  description: string;
  label: string;
  tone: keyof typeof toneStyles;
}[];

const quickPrompts = [
  "Summarize this week's risk",
  "Who's blocked right now?",
  "Draft a standup update",
];

export function AiAssistantPreview() {
  return (
    <Card className="overflow-hidden border-border/80 bg-card py-0 shadow-xl shadow-black/10">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/10 to-transparent">
            <Sparkles className="size-4 text-primary" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                DevFlow AI
              </p>

              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-xs font-normal"
              >
                Beta
              </Badge>
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Engineering intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          Project synced
        </div>
      </CardHeader>

      <Separator />

      {/* Context bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Context</span>

          <Badge variant="outline" className="gap-1.5 font-normal">
            <FileCode2 className="size-3" />
            DevFlow Web
          </Badge>

          <Badge variant="outline" className="font-normal">
            Sprint 12
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ListChecks className="size-3.5" />
            24 issues
          </span>
          <span className="flex items-center gap-1.5">
            <GitPullRequest className="size-3.5" />8 PRs
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />6 members
          </span>
        </div>
      </div>

      <Separator />

      <CardContent className="space-y-6 px-5 py-5">
        {/* User */}
        <div className="flex justify-end gap-2.5">
          <div className="max-w-md rounded-xl rounded-tr-sm bg-secondary px-4 py-3">
            <p className="text-sm leading-6 text-foreground">
              What should the team focus on next to keep this sprint on track?
            </p>
          </div>

          <Avatar className="size-8 border border-border">
            <AvatarFallback className="text-xs">NM</AvatarFallback>
          </Avatar>
        </div>

        {/* AI response */}
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/10 to-transparent">
            <WandSparkles className="size-4 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">DevFlow AI</p>

              <span className="text-xs text-muted-foreground">
                analyzed your sprint
              </span>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Sprint 12 is progressing well, but two blockers could affect
              delivery. I&apos;d prioritize these items next:
            </p>

            {/* Priority panel */}
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between bg-muted/30 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-primary" />

                  <span className="text-xs font-medium text-foreground">
                    Recommended priorities
                  </span>
                </div>

                <span className="text-xs text-muted-foreground">
                  Based on project context
                </span>
              </div>

              <Separator />

              <div>
                {priorities.map((priority, index) => {
                  const Icon = priority.icon;
                  const tone = toneStyles[priority.tone];

                  return (
                    <div key={priority.title}>
                      <button
                        type="button"
                        className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none"
                      >
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-md ${tone.iconBg}`}
                        >
                          <Icon className={`size-4 ${tone.iconColor}`} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {priority.title}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                            <span
                              className={`size-1.5 shrink-0 rounded-full ${tone.dot}`}
                            />
                            <span>{priority.description}</span>
                            <span>·</span>
                            <span>{priority.label}</span>
                          </div>
                        </div>

                        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </button>

                      {index !== priorities.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button size="sm">
                <ListTodo />
                Create tasks
              </Button>

              <Button size="sm" variant="outline">
                Open sprint
              </Button>

              <Button size="sm" variant="ghost">
                Explain priorities
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <Separator />

      {/* Prompt */}
      <CardFooter className="flex-col items-stretch gap-2.5 bg-muted/20 p-4">
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt) => (
            <Badge
              key={prompt}
              variant="outline"
              className="font-normal text-muted-foreground"
            >
              {prompt}
            </Badge>
          ))}
        </div>

        <div className="w-full rounded-lg border border-border bg-background p-2 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
          <Textarea
            placeholder="Ask DevFlow AI about this project..."
            readOnly
            rows={2}
            className="min-h-14 resize-none border-0 bg-transparent px-2 py-1 shadow-none focus-visible:ring-0"
          />

          <div className="mt-1 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="font-normal text-muted-foreground"
              >
                DevFlow Web
              </Badge>

              <span className="hidden text-xs text-muted-foreground sm:inline">
                Project context enabled
              </span>
            </div>

            <Button size="icon" className="size-8" aria-label="Send message">
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
