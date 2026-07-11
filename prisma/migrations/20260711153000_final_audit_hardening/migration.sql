-- Final audit hardening: add indexes for authorization, cart, order, promo, and review flows.
CREATE INDEX IF NOT EXISTS "carts_user_id_idx" ON "carts"("user_id");

CREATE INDEX IF NOT EXISTS "cart_items_cart_id_kind_product_id_idx"
  ON "cart_items"("cart_id", "kind", "product_id");

CREATE INDEX IF NOT EXISTS "cart_items_cart_id_kind_ampas_listing_id_idx"
  ON "cart_items"("cart_id", "kind", "ampas_listing_id");

CREATE INDEX IF NOT EXISTS "reviews_seller_id_idx" ON "reviews"("seller_id");

CREATE UNIQUE INDEX IF NOT EXISTS "reviews_product_id_user_id_key"
  ON "reviews"("product_id", "user_id");

CREATE INDEX IF NOT EXISTS "promos_status_starts_at_ends_at_idx"
  ON "promos"("status", "starts_at", "ends_at");

CREATE INDEX IF NOT EXISTS "promos_seller_id_idx" ON "promos"("seller_id");

CREATE INDEX IF NOT EXISTS "orders_status_created_at_idx"
  ON "orders"("status", "created_at");

CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items"("order_id");
