-- Payment Core Schema: custom Midtrans Core UI, order tracking, and seller fulfillment.

CREATE TYPE "PaymentMethod" AS ENUM ('QRIS', 'VIRTUAL_ACCOUNT', 'EWALLET', 'MANUAL_TRANSFER');

CREATE TYPE "OrderFulfillmentStatus" AS ENUM (
    'PENDING_PAYMENT',
    'READY_TO_PROCESS',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);

ALTER TABLE "orders"
    ADD COLUMN "discount_amount" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "discount_currency" TEXT NOT NULL DEFAULT 'IDR',
    ADD COLUMN "promo_code" TEXT,
    ADD COLUMN "receiver_name" TEXT,
    ADD COLUMN "receiver_phone" TEXT,
    ADD COLUMN "shipping_address" TEXT,
    ADD COLUMN "shipping_city" TEXT,
    ADD COLUMN "shipping_province" TEXT,
    ADD COLUMN "courier_code" TEXT,
    ADD COLUMN "courier_name" TEXT,
    ADD COLUMN "payment_expires_at" TIMESTAMP(3);

ALTER TABLE "order_items"
    ADD COLUMN "seller_id" TEXT;

UPDATE "order_items" AS oi
SET "seller_id" = COALESCE(product_sellers."seller_id", ampas_sellers."seller_id")
FROM (
    SELECT "id", "seller_id"
    FROM "products"
) AS product_sellers
FULL OUTER JOIN (
    SELECT "id", "seller_id"
    FROM "ampas_listings"
) AS ampas_sellers ON FALSE
WHERE oi."product_id" = product_sellers."id"
   OR oi."ampas_listing_id" = ampas_sellers."id";

ALTER TABLE "payments"
    ADD COLUMN "payment_method" "PaymentMethod",
    ADD COLUMN "transaction_id" TEXT,
    ADD COLUMN "transaction_status" TEXT,
    ADD COLUMN "fraud_status" TEXT,
    ADD COLUMN "va_number" TEXT,
    ADD COLUMN "qr_string" TEXT,
    ADD COLUMN "qr_url" TEXT,
    ADD COLUMN "deeplink_url" TEXT,
    ADD COLUMN "raw_response" JSONB,
    ADD COLUMN "raw_notification" JSONB,
    ADD COLUMN "paid_at" TIMESTAMP(3),
    ADD COLUMN "expired_at" TIMESTAMP(3),
    ADD COLUMN "last_status_synced_at" TIMESTAMP(3);

CREATE TABLE "order_fulfillments" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "status" "OrderFulfillmentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "tracking_number" TEXT,
    "shipping_note" TEXT,
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_fulfillments_pkey" PRIMARY KEY ("id")
);

INSERT INTO "order_fulfillments" (
    "id",
    "order_id",
    "seller_id",
    "status",
    "created_at",
    "updated_at"
)
SELECT
    CONCAT('fulfillment-', oi."order_id", '-', oi."seller_id"),
    oi."order_id",
    oi."seller_id",
    CASE
        WHEN o."status" = 'PAID' THEN 'READY_TO_PROCESS'::"OrderFulfillmentStatus"
        WHEN o."status" = 'FULFILLED' THEN 'DELIVERED'::"OrderFulfillmentStatus"
        ELSE 'PENDING_PAYMENT'::"OrderFulfillmentStatus"
    END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "order_items" oi
JOIN "orders" o ON o."id" = oi."order_id"
WHERE oi."seller_id" IS NOT NULL
GROUP BY oi."order_id", oi."seller_id", o."status"
ON CONFLICT DO NOTHING;

CREATE INDEX "order_items_seller_id_idx" ON "order_items"("seller_id");
CREATE INDEX "payments_order_id_status_idx" ON "payments"("order_id", "status");
CREATE INDEX "payments_transaction_id_idx" ON "payments"("transaction_id");
CREATE UNIQUE INDEX "order_fulfillments_order_id_seller_id_key" ON "order_fulfillments"("order_id", "seller_id");
CREATE INDEX "order_fulfillments_seller_id_status_idx" ON "order_fulfillments"("seller_id", "status");

ALTER TABLE "order_fulfillments"
    ADD CONSTRAINT "order_fulfillments_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "order_fulfillments"
    ADD CONSTRAINT "order_fulfillments_seller_id_fkey"
    FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
