ALTER TABLE "github_pull_requests" ADD COLUMN "additions" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "github_pull_requests" ADD COLUMN "deletions" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "github_pull_requests" ADD COLUMN "changed_files" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "github_pull_requests" ADD COLUMN "commits_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "github_pull_requests" ADD COLUMN "comments_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "github_pull_requests" ADD COLUMN "review_comments_count" integer DEFAULT 0 NOT NULL;