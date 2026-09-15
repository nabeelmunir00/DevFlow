CREATE TABLE "task_github_pull_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"pull_request_id" uuid NOT NULL,
	"linked_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_github_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"issue_id" uuid NOT NULL,
	"linked_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "task_github_pull_requests" ADD CONSTRAINT "task_github_pull_requests_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_github_pull_requests" ADD CONSTRAINT "task_github_pull_requests_pull_request_id_github_pull_requests_id_fk" FOREIGN KEY ("pull_request_id") REFERENCES "public"."github_pull_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_github_pull_requests" ADD CONSTRAINT "task_github_pull_requests_linked_by_id_users_id_fk" FOREIGN KEY ("linked_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_github_issues" ADD CONSTRAINT "task_github_issues_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_github_issues" ADD CONSTRAINT "task_github_issues_issue_id_github_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."github_issues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_github_issues" ADD CONSTRAINT "task_github_issues_linked_by_id_users_id_fk" FOREIGN KEY ("linked_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "task_github_pr_task_pr_unique" ON "task_github_pull_requests" USING btree ("task_id","pull_request_id");--> statement-breakpoint
CREATE INDEX "task_github_pr_task_idx" ON "task_github_pull_requests" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_github_pr_pr_idx" ON "task_github_pull_requests" USING btree ("pull_request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "task_github_issue_task_issue_unique" ON "task_github_issues" USING btree ("task_id","issue_id");--> statement-breakpoint
CREATE INDEX "task_github_issue_task_idx" ON "task_github_issues" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_github_issue_issue_idx" ON "task_github_issues" USING btree ("issue_id");