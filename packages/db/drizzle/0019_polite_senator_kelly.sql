CREATE TABLE "github_pull_request_commits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pull_request_id" uuid NOT NULL,
	"sha" varchar(64) NOT NULL,
	"message" text NOT NULL,
	"author_name" varchar(255),
	"author_email" varchar(320),
	"author_login" varchar(255),
	"author_date" timestamp with time zone,
	"committer_name" varchar(255),
	"committer_email" varchar(320),
	"committer_login" varchar(255),
	"committer_date" timestamp with time zone,
	"html_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "github_pull_request_commits" ADD CONSTRAINT "github_pull_request_commits_pull_request_id_github_pull_requests_id_fk" FOREIGN KEY ("pull_request_id") REFERENCES "public"."github_pull_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "github_pull_request_commits_pr_sha_unique" ON "github_pull_request_commits" USING btree ("pull_request_id","sha");--> statement-breakpoint
CREATE INDEX "github_pull_request_commits_pull_request_idx" ON "github_pull_request_commits" USING btree ("pull_request_id");--> statement-breakpoint
CREATE INDEX "github_pull_request_commits_sha_idx" ON "github_pull_request_commits" USING btree ("sha");