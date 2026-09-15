CREATE TABLE "github_pull_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"repository_id" uuid NOT NULL,
	"github_pull_request_id" bigint NOT NULL,
	"github_number" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"body" text,
	"state" varchar(30) NOT NULL,
	"is_draft" boolean DEFAULT false NOT NULL,
	"author_login" varchar(255),
	"head_ref" varchar(255),
	"base_ref" varchar(255),
	"html_url" text NOT NULL,
	"merged" boolean DEFAULT false NOT NULL,
	"github_created_at" timestamp with time zone,
	"github_updated_at" timestamp with time zone,
	"github_closed_at" timestamp with time zone,
	"github_merged_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "github_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"repository_id" uuid NOT NULL,
	"github_issue_id" bigint NOT NULL,
	"github_number" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"body" text,
	"state" varchar(30) NOT NULL,
	"author_login" varchar(255),
	"assignee_login" varchar(255),
	"html_url" text NOT NULL,
	"github_created_at" timestamp with time zone,
	"github_updated_at" timestamp with time zone,
	"github_closed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_repository_id_github_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."github_repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_issues" ADD CONSTRAINT "github_issues_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_issues" ADD CONSTRAINT "github_issues_repository_id_github_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."github_repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "github_pull_requests_github_id_unique" ON "github_pull_requests" USING btree ("github_pull_request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "github_pull_requests_repo_number_unique" ON "github_pull_requests" USING btree ("repository_id","github_number");--> statement-breakpoint
CREATE INDEX "github_pull_requests_organization_idx" ON "github_pull_requests" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "github_pull_requests_repository_idx" ON "github_pull_requests" USING btree ("repository_id");--> statement-breakpoint
CREATE INDEX "github_pull_requests_state_idx" ON "github_pull_requests" USING btree ("state");--> statement-breakpoint
CREATE UNIQUE INDEX "github_issues_github_id_unique" ON "github_issues" USING btree ("github_issue_id");--> statement-breakpoint
CREATE UNIQUE INDEX "github_issues_repo_number_unique" ON "github_issues" USING btree ("repository_id","github_number");--> statement-breakpoint
CREATE INDEX "github_issues_organization_idx" ON "github_issues" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "github_issues_repository_idx" ON "github_issues" USING btree ("repository_id");--> statement-breakpoint
CREATE INDEX "github_issues_state_idx" ON "github_issues" USING btree ("state");