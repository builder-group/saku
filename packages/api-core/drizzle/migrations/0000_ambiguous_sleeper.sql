CREATE TABLE "shopify_session" (
	"session_id" text PRIMARY KEY NOT NULL,
	"shop_id" text NOT NULL,
	"is_online" text NOT NULL,
	"access_token" text NOT NULL,
	"scopes" text NOT NULL,
	"state" text NOT NULL,
	"session_data" jsonb,
	"expires_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_account" (
	"user_id" text NOT NULL,
	"account_type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"provider_data" jsonb,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "site_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "site_connection" (
	"site_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "site_connection_site_id_provider_provider_account_id_pk" PRIMARY KEY("site_id","provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "site" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"handle" text NOT NULL,
	"display_name" text,
	"content" jsonb,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "site_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "user_account" (
	"user_id" text NOT NULL,
	"account_type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"provider_data" jsonb,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "user_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"display_name" text,
	"image" text,
	"email" text,
	"email_verified_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "user_handle_unique" UNIQUE("handle"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "site_account" ADD CONSTRAINT "site_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_connection" ADD CONSTRAINT "site_connection_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_connection" ADD CONSTRAINT "fk_site_connection_site_account" FOREIGN KEY ("provider","provider_account_id") REFERENCES "public"."site_account"("provider","provider_account_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;