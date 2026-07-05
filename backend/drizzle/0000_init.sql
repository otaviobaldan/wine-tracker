CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"winery" text NOT NULL,
	"year" integer,
	"type" text NOT NULL,
	"grape" text NOT NULL,
	"grape_origin" text NOT NULL,
	"where_tried" text NOT NULL,
	"city_sipped_in" text,
	"when_tried" date,
	"score" integer NOT NULL,
	"personal_feels" text NOT NULL,
	"notes" text,
	"description_by_ai" text,
	"bottle_photo_url" text,
	"price" numeric(10, 2),
	"purchase_location" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "score_range" CHECK ("wines"."score" BETWEEN 1 AND 5)
);
