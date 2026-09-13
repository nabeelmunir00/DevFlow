CREATE TABLE "github_installations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"connected_by_id" uuid NOT NULL,
	"github_installation_id" bigint NOT NULL,
	"github_account_id" bigint NOT NULL,
	"account_login" varchar(255) NOT NULL,
	"account_type" varchar(50) NOT NULL,
	"target_type" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"disconnected_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "github_repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"installation_id" uuid NOT NULL,
	"project_id" uuid,
	"github_repository_id" bigint NOT NULL,
	"owner_login" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"full_name" varchar(500) NOT NULL,
	"default_branch" varchar(255),
	"html_url" varchar(1000),
	"is_private" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_connected_by_id_users_id_fk" FOREIGN KEY ("connected_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_repositories" ADD CONSTRAINT "github_repositories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_repositories" ADD CONSTRAINT "github_repositories_installation_id_github_installations_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."github_installations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_repositories" ADD CONSTRAINT "github_repositories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "github_installations_github_id_unique" ON "github_installations" USING btree ("github_installation_id");--> statement-breakpoint
CREATE INDEX "github_installations_org_idx" ON "github_installations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "github_installations_account_idx" ON "github_installations" USING btree ("github_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "github_repositories_github_id_unique" ON "github_repositories" USING btree ("github_repository_id");--> statement-breakpoint
CREATE INDEX "github_repositories_org_idx" ON "github_repositories" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "github_repositories_installation_idx" ON "github_repositories" USING btree ("installation_id");--> statement-breakpoint
CREATE INDEX "github_repositories_project_idx" ON "github_repositories" USING btree ("project_id");