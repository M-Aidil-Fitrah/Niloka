-- CreateEnum
CREATE TYPE "UploadedAssetKind" AS ENUM ('PRODUCT_IMAGE', 'CATEGORY_IMAGE', 'AMPAS_IMAGE', 'ARTICLE_IMAGE', 'USER_AVATAR', 'DOCUMENT');

-- AlterTable
ALTER TABLE "ampas_listings" ADD COLUMN     "image_asset_id" TEXT;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "image_asset_id" TEXT;

-- AlterTable
ALTER TABLE "product_categories" ADD COLUMN     "image_asset_id" TEXT;

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "asset_id" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "image_asset_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image_asset_id" TEXT;

-- CreateTable
CREATE TABLE "uploaded_assets" (
    "id" TEXT NOT NULL,
    "kind" "UploadedAssetKind" NOT NULL,
    "uploaded_by_id" TEXT,
    "original_filename" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "public_path" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL DEFAULT 'image/webp',
    "size_bytes" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "checksum" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploaded_assets_storage_key_key" ON "uploaded_assets"("storage_key");

-- CreateIndex
CREATE UNIQUE INDEX "uploaded_assets_public_path_key" ON "uploaded_assets"("public_path");

-- CreateIndex
CREATE INDEX "uploaded_assets_kind_idx" ON "uploaded_assets"("kind");

-- CreateIndex
CREATE INDEX "uploaded_assets_uploaded_by_id_idx" ON "uploaded_assets"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "ampas_listings_image_asset_id_idx" ON "ampas_listings"("image_asset_id");

-- CreateIndex
CREATE INDEX "products_image_asset_id_idx" ON "products"("image_asset_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_image_asset_id_fkey" FOREIGN KEY ("image_asset_id") REFERENCES "uploaded_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_asset_id_fkey" FOREIGN KEY ("image_asset_id") REFERENCES "uploaded_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_image_asset_id_fkey" FOREIGN KEY ("image_asset_id") REFERENCES "uploaded_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "uploaded_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ampas_listings" ADD CONSTRAINT "ampas_listings_image_asset_id_fkey" FOREIGN KEY ("image_asset_id") REFERENCES "uploaded_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_image_asset_id_fkey" FOREIGN KEY ("image_asset_id") REFERENCES "uploaded_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_assets" ADD CONSTRAINT "uploaded_assets_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
