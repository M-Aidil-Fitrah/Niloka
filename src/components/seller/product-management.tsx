"use client";

import { useState, useEffect } from "react";
import type { Product, ProductForm } from "@/lib/contracts";
import { showToast } from "@/components/dashboard/dashboard-layout";
import { ProductTable } from "./product/product-table";
import { ProductDrawer } from "./product/product-drawer";

type ProductManagementProps = {
  products: Product[];
};

export function ProductManagement({ products: initialProducts }: ProductManagementProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isEditing, setIsEditing] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Partial<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSellerId, setCurrentSellerId] = useState("seller-aceh-aroma");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("niloka_products");
      if (stored) {
        setProducts(JSON.parse(stored));
      }
      const user = localStorage.getItem("niloka_current_user");
      if (user && user !== "buyer") {
        setCurrentSellerId(user);
      }
    }
  }, []);
  
  const itemsPerPage = 6;
  const sellerProducts = products.filter((p) => p.sellerId === currentSellerId);
  const totalPages = Math.ceil(sellerProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sellerProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const handleCloseDrawers = () => {
      setIsEditing(false);
    };
    window.addEventListener("close-all-drawers", handleCloseDrawers);
    return () => window.removeEventListener("close-all-drawers", handleCloseDrawers);
  }, []);

  const handleOpenAdd = () => {
    setActiveProduct({
      id: `prod-${Date.now()}`,
      slug: "",
      sellerId: currentSellerId,
      name: "",
      shortDescription: "",
      price: { amount: 0, currency: "IDR" },
      originalPrice: { amount: 0, currency: "IDR" },
      stock: 10,
      status: "draft",
      form: "essential-oil",
      functions: ["relaxation"],
      tags: ["new-arrival"],
      image: { src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop", alt: "Product Cover" },
      gallery: [],
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (product: Product) => {
    setActiveProduct({ ...product });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const filtered = products.filter((p) => p.id !== id);
    setProducts(filtered);
    if (typeof window !== "undefined") {
      localStorage.setItem("niloka_products", JSON.stringify(filtered));
    }
    const filteredSellerProds = filtered.filter((p) => p.sellerId === currentSellerId);
    const newTotalPages = Math.ceil(filteredSellerProds.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
    showToast("Produk berhasil dihapus dari katalog.", "success");
  };

  const handleSave = () => {
    if (!activeProduct?.name || !activeProduct?.price?.amount) {
      showToast("Nama produk dan harga wajib diisi.", "warning");
      return;
    }

    const updated = activeProduct as Product;
    if (!updated.slug) {
      updated.slug = updated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    let updatedProducts: Product[] = [];
    if (products.some((p) => p.id === updated.id)) {
      updatedProducts = products.map((p) => (p.id === updated.id ? updated : p));
    } else {
      updatedProducts = [updated, ...products];
      setCurrentPage(1);
    }
    setProducts(updatedProducts);
    if (typeof window !== "undefined") {
      localStorage.setItem("niloka_products", JSON.stringify(updatedProducts));
    }
    setIsEditing(false);
    setActiveProduct(null);
    showToast("Produk berhasil disimpan ke katalog!", "success");
  };

  return (
    <div className="space-y-8">
      <ProductTable
        products={paginatedProducts}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        onOpenAdd={handleOpenAdd}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <ProductDrawer
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        activeProduct={activeProduct}
        setActiveProduct={setActiveProduct}
        onSave={handleSave}
        products={products}
      />
    </div>
  );
}
