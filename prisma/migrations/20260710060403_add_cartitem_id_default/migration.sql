-- CreateIndex
CREATE INDEX "ampas_listings_status_idx" ON "ampas_listings"("status");

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "reviews_product_id_idx" ON "reviews"("product_id");
