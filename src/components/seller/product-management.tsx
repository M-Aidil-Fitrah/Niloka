"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/contracts";
import { showToast } from "@/components/dashboard/dashboard-layout";
import { ProductTable } from "./product/product-table";
import { ProductDrawer } from "./product/product-drawer";
import { useAuth } from "@/context/auth-context";
import { saveProductAction, deleteProductAction } from "@/lib/actions/product-actions";

type ProductManagementProps = {
  products: Product[];
};

export function ProductManagement({ products: initialProducts }: ProductManagementProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isEditing, setIsEditing] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Partial<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const currentSellerId = user?.sellerId || "seller-aceh-aroma";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(initialProducts);
  }, [initialProducts]);

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
      categoryId: "cat-atsiri-murni", // Default category to prevent empty category error
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
    deleteProductAction(id).then((res) => {
      if (res.ok) {
        const filtered = products.filter((p) => p.id !== id);
        setProducts(filtered);
        const filteredSellerProds = filtered.filter((p) => p.sellerId === currentSellerId);
        const newTotalPages = Math.ceil(filteredSellerProds.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        showToast("Produk berhasil dihapus dari katalog.", "success");
      } else {
        showToast(res.message, "error");
      }
    }).catch((err) => {
      console.error(err);
      showToast("Gagal menghapus produk.", "error");
    });
  };

  const handleSave = () => {
    if (!activeProduct?.name || !activeProduct?.price?.amount) {
      showToast("Nama produk dan harga wajib diisi.", "warning");
      return;
    }

    const updated = { ...activeProduct } as Product;
    if (!updated.slug) {
      updated.slug = updated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    saveProductAction(updated).then((res) => {
      if (res.ok) {
        if (products.some((p) => p.id === updated.id)) {
          setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        } else {
          setProducts([updated, ...products]);
          setCurrentPage(1);
        }
        setIsEditing(false);
        setActiveProduct(null);
        showToast("Produk berhasil disimpan ke katalog!", "success");
      } else {
        showToast(res.message, "error");
      }
    }).catch((err) => {
      console.error(err);
      showToast("Gagal menyimpan produk.", "error");
    });
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
