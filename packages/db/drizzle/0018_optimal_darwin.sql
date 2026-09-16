CREATE TABLE "github_pull_request_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pull_request_id" uuid NOT NULL,
	"filename" varchar(1000) NOT NULL,
	"status" varchar(50) NOT NULL,
	"additions" integer DEFAULT 0 NOT NULL,
	"deletions" integer DEFAULT 0 NOT NULL,
	"changes" integer DEFAULT 0 NOT NULL,
	"patch" text,
	"previous_filename" varchar(1000),
	"blob_url" text,
	"raw_url" text,
	"contents_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "github_pull_request_files" ADD CONSTRAINT "github_pull_request_files_pull_request_id_github_pull_requests_id_fk" FOREIGN KEY ("pull_request_id") REFERENCES "public"."github_pull_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "github_pull_request_files_pr_filename_unique" ON "github_pull_request_files" USING btree ("pull_request_id","filename");--> statement-breakpoint
CREATE INDEX "github_pull_request_files_pull_request_idx" ON "github_pull_request_files" USING btree ("pull_request_id");--> statement-breakpoint
CREATE INDEX "github_pull_request_files_status_idx" ON "github_pull_request_files" USING btree ("status");