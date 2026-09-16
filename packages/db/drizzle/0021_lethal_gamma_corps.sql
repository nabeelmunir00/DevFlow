CREATE TABLE "github_pull_request_review_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pull_request_id" uuid NOT NULL,
	"github_comment_id" varchar(64) NOT NULL,
	"github_review_id" varchar(64),
	"author_login" varchar(255),
	"body" text NOT NULL,
	"path" text NOT NULL,
	"line" integer,
	"original_line" integer,
	"start_line" integer,
	"original_start_line" integer,
	"side" varchar(20),
	"start_side" varchar(20),
	"commit_sha" varchar(64),
	"original_commit_sha" varchar(64),
	"diff_hunk" text,
	"html_url" text,
	"github_created_at" timestamp with time zone,
	"github_updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "github_pull_request_review_comments" ADD CONSTRAINT "github_pull_request_review_comments_pull_request_id_github_pull_requests_id_fk" FOREIGN KEY ("pull_request_id") REFERENCES "public"."github_pull_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "github_pr_review_comments_github_id_unique" ON "github_pull_request_review_comments" USING btree ("github_comment_id");--> statement-breakpoint
CREATE INDEX "github_pr_review_comments_pull_request_idx" ON "github_pull_request_review_comments" USING btree ("pull_request_id");--> statement-breakpoint
CREATE INDEX "github_pr_review_comments_review_idx" ON "github_pull_request_review_comments" USING btree ("github_review_id");--> statement-breakpoint
CREATE INDEX "github_pr_review_comments_author_idx" ON "github_pull_request_review_comments" USING btree ("author_login");--> statement-breakpoint
CREATE INDEX "github_pr_review_comments_path_idx" ON "github_pull_request_review_comments" USING btree ("path");