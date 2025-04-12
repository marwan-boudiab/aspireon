ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_orderId_productId_pk";--> statement-breakpoint
ALTER TABLE "orderItems" ALTER COLUMN "size" SET DEFAULT 'NS';--> statement-breakpoint
ALTER TABLE "orderItems" ALTER COLUMN "size" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_productId_size_pk" PRIMARY KEY("orderId","productId","size");