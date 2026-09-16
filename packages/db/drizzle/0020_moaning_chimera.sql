CREATE TABLE "github_pull_request_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pull_request_id" uuid NOT NULL,
	"github_review_id" varchar(64) NOT NULL,
	"reviewer_login" varchar(255),
	"state" varchar(50) NOT NULL,
	"body" text,
	"commit_sha" varchar(64),
	"html_url" text,
	"submitted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "github_pull_request_reviews" ADD CONSTRAINT "github_pull_request_reviews_pull_request_id_github_pull_requests_id_fk" FOREIGN KEY ("pull_request_id") REFERENCES "public"."github_pull_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "github_pull_request_reviews_github_id_unique" ON "github_pull_request_reviews" USING btree ("github_review_id");--> statement-breakpoint
CREATE INDEX "github_pull_request_reviews_pull_request_idx" ON "github_pull_request_reviews" USING btree ("pull_request_id");--> statement-breakpoint
CREATE INDEX "github_pull_request_reviews_state_idx" ON "github_pull_request_reviews" USING btree ("state");--> statement-breakpoint
CREATE INDEX "github_pull_request_reviews_reviewer_idx" ON "github_pull_request_reviews" USING btree ("reviewer_login");