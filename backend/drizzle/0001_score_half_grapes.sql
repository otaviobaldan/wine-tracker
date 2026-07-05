ALTER TABLE "wines" DROP CONSTRAINT "score_range";--> statement-breakpoint
ALTER TABLE "wines" ALTER COLUMN "score" SET DATA TYPE numeric(2, 1);--> statement-breakpoint
ALTER TABLE "wines" ADD CONSTRAINT "score_range" CHECK ("wines"."score" BETWEEN 0.5 AND 5 AND "wines"."score" = ROUND("wines"."score" * 2) / 2);