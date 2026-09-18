import {
  ArrowRight,
  Check,
  GitBranch,
  GitPullRequest,
  GitCommitHorizontal,
  Link2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const benefits = [
  "Link pull requests directly to DevFlow issues",
  "Track commits and development activity",
  "Keep task status synced with engineering work",
];

export function GithubWorkflow() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto grid max-w-screen-2xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:px-12 xl:gap-20">
        {/* Left content */}
        <div className="max-w-xl">
          <Badge
            variant="outline"
            className="gap-2 border-primary/20 bg-primary/5 text-primary"
          >
            <GitBranch className="size-3.5" />
            GitHub integration
          </Badge>

          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Connect your code
            <br />
            to your workflow
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            Keep issues, branches, commits, and pull requests connected to the
            work your team is already managing in DevFlow.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-3.5 text-primary" />
                </div>

                <p className="text-sm text-foreground">{benefit}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" size="lg" className="mt-9">
            Explore GitHub integration
            <ArrowRight />
          </Button>
        </div>

        {/* Workflow preview */}
        <GithubWorkflowPreview />
      </div>
    </section>
  );
}

function GithubWorkflowPreview() {
  return (
    <Card className="overflow-hidden border-border/80 bg-card py-0 shadow-xl shadow-black/10">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary">
            <GitBranch className="size-4 text-foreground" />
          </div>

          <div>
            <CardTitle className="text-sm">Development activity</CardTitle>

            <p className="mt-0.5 text-xs text-muted-foreground">
              devflow / web
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="gap-1.5 font-normal">
          <span className="size-1.5 rounded-full bg-success" />
          Synced
        </Badge>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {/* DevFlow issue */}
        <div className="px-5 py-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">DEV-142</Badge>

              <Badge variant="secondary" className="text-info">
                In progress
              </Badge>
            </div>

            <span className="text-xs text-muted-foreground">
              Updated just now
            </span>
          </div>

          <h3 className="font-heading text-base font-medium text-foreground">
            Improve project dashboard performance
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Optimize project queries and reduce dashboard loading time.
          </p>
        </div>

        <Separator />

        {/* Branch */}
        <WorkflowRow
          icon={GitBranch}
          label="Branch created"
          title="feat/DEV-142-dashboard-performance"
        />

        <Separator />

        {/* Commits */}
        <div className="px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <GitCommitHorizontal className="size-4 text-muted-foreground" />

            <span className="text-xs font-medium text-muted-foreground">
              Recent commits
            </span>
          </div>

          <div className="space-y-3 pl-6">
            <Commit hash="8ac4f2" message="optimize project queries" />

            <Commit hash="29b8de" message="add dashboard loading states" />

            <Commit hash="a17c91" message="reduce duplicate API requests" />
          </div>
        </div>

        <Separator />

        {/* Pull request */}
        <div className="px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <GitPullRequest className="size-4 text-success" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-foreground">
                  Improve dashboard performance
                </p>

                <Badge variant="outline" className="text-success">
                  PR #128
                </Badge>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                nabeel merged 3 commits into main
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="gap-1.5 font-normal text-success"
                >
                  <Check className="size-3" />
                  Checks passed
                </Badge>

                <Badge variant="secondary" className="font-normal">
                  Ready for review
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Automatic sync */}
        <div className="bg-muted/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Link2 className="size-4 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                DevFlow updated DEV-142
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Issue moved from In progress → In review
              </p>
            </div>

            <Badge variant="outline" className="hidden font-normal sm:flex">
              Automated
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface WorkflowRowProps {
  icon: typeof GitBranch;
  label: string;
  title: string;
}

function WorkflowRow({ icon: Icon, label, title }: WorkflowRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-0.5 truncate font-mono text-xs text-foreground">
          {title}
        </p>
      </div>
    </div>
  );
}

interface CommitProps {
  hash: string;
  message: string;
}

function Commit({ hash, message }: CommitProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="shrink-0 font-mono text-xs text-primary">{hash}</span>

      <p className="truncate text-xs text-muted-foreground">{message}</p>
    </div>
  );
}
