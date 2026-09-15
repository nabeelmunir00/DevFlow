CREATE TABLE "github_webhook_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_id" varchar(255) NOT NULL,
	"event" varchar(100) NOT NULL,
	"action" varchar(100),
	"status" varchar(30) DEFAULT 'PROCESSING' NOT NULL,
	"processed_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "github_webhook_deliveries_delivery_id_unique" UNIQUE("delivery_id")
);
--> statement-breakpoint
CREATE INDEX "github_webhook_deliveries_event_idx" ON "github_webhook_deliveries" USING btree ("event");--> statement-breakpoint
CREATE INDEX "github_webhook_deliveries_status_idx" ON "github_webhook_deliveries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "github_webhook_deliveries_created_at_idx" ON "github_webhook_deliveries" USING btree ("created_at");