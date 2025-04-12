ALTER TABLE "product" ALTER COLUMN "sale_percentage" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "sale_percentage" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "promotionEndDate" timestamp;