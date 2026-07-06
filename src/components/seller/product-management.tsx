import { useState } from "react";
import Image from "next/image";
import { formatRupiah } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Plus, X, Sparkles, Copy, Check, Info } from "lucide-react";
import type { Product } from "@/lib/contracts";

type PassportDraft = {
  productId: string;
  status: "draft" | "submitted" | "verified";
};

type ProductManagementProps = {
  sellerProducts: Product[];
  passportDrafts: PassportDraft[];
  onAddProduct: (prod: { name: string; price: number; stock: number; category: string }) => void;
};

export function ProductManagement({
  sellerProducts,
  passportDrafts,
  onAddProduct,
}: ProductManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(75000);
  const [stock, setStock] = useState(50);
  const [category, setCategory] = useState("essential-oils");

  // AI Description Generator state
  const [aiPaLevel, setAiPaLevel] = useState("32.5%");
  const [aiOrigin, setAiOrigin] = useState("Kecamatan Meukek, Aceh Selatan");
  const [aiAroma, setAiAroma] = useState("Woody, manis balsamic lembut, dan tahan lama");
  const [aiForm, setAiForm] = useState("Minyak Atsiri Nilam Murni (Essential Oil)");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [displayedAiOutput, setDisplayedAiOutput] = useState("");
  const [aiOutputText, setAiOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsAiGenerating(true);
    setDisplayedAiOutput("");
    setAiOutputText("");
    setCopied(false);

    const templates = [
      `Minyak Nilam Murni premium asal ${aiOrigin}. Diproduksi dengan metode penyulingan uap tradisional berkualitas tinggi, menghasilkan aroma ${aiAroma} yang pekat dan berkarakter. Memiliki kadar Patchouli Alcohol (PA) tinggi mencapai ${aiPaLevel}, menjadikannya zat pengikat wewangian (fixative) yang sangat baik untuk parfum Anda. Produk ini telah lolos uji transparansi Nilam Passport, menjamin keaslian 100% tanpa campuran minyak sintetis.`,
      `Nikmati esensi relaksasi dari ${aiForm} khas ${aiOrigin}. Diformulasikan dengan minyak atsiri nilam Aceh berkualitas terbaik (kadar PA ${aiPaLevel}), menghasilkan profil aroma ${aiAroma} yang memikat dan menenangkan sistem saraf. Sangat cocok sebagai aromaterapi ruangan, minyak pijat, maupun pengikat parfum alami. Diproses secara berkelanjutan dengan prinsip sirkular ekonomi terpadu.`,
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setAiOutputText(randomTemplate);

    setTimeout(() => {
      setIsAiGenerating(false);
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < randomTemplate.length) {
          setDisplayedAiOutput((prev) => prev + randomTemplate.charAt(currentIdx));
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 6);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiOutputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddProduct({ name, price, stock, category });
    setIsModalOpen(false);
    setName("");
    setPrice(75000);
    setStock(50);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header toolbar */}
      <div className="flex justify-between items-center gap-4 flex-wrap pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-zinc-100">Katalog Produk B2C Retail</h3>
          <p className="text-xs text-zinc-400 mt-1">Daftar produk retail yang terbit di katalog publik NILOKA.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk (Mock)
        </Button>
      </div>

      {/* Table grid */}
      <div className="border border-zinc-800 bg-zinc-900/20 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-bold">
                <th className="p-4">Info Produk</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Passport Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sellerProducts.map((prod) => {
                const passport = passportDrafts.find((p) => p.productId === prod.id);
                return (
                  <tr key={prod.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 flex items-center gap-3 min-w-[240px]">
                      <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-zinc-800 border border-zinc-700/50 shrink-0">
                        <Image src={prod.image.src} alt={prod.image.alt} className="object-cover" fill sizes="44px" />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-100 block">{prod.name}</span>
                        <span className="text-[10px] text-zinc-400 block truncate max-w-xs">{prod.shortDescription}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-zinc-300 uppercase text-[9px] tracking-wider">{prod.categoryId}</td>
                    <td className="p-4 font-bold text-zinc-100">{formatRupiah(prod.price.amount)}</td>
                    <td className="p-4 font-semibold text-zinc-400">{prod.stock} unit</td>
                    <td className="p-4">
                      <span
                        className={`inline-block text-[9px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${
                          passport?.status === "verified"
                            ? "bg-emerald-950/40 border-emerald-900/40 text-emerald-400"
                            : passport?.status === "submitted"
                            ? "bg-sky-950/40 border-sky-900/40 text-sky-400"
                            : "bg-zinc-800/40 border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {passport?.status === "verified" ? "Terverifikasi" : passport?.status === "submitted" ? "Diajukan" : "Belum Ada"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Assistant Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-800 rounded-lg text-zinc-100">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">AI Product Description Writer</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Tulis deskripsi produk berkualitas tinggi berbasis parameter sensorik.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          {/* Inputs */}
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Tipe / Form Produk</label>
              <input
                type="text"
                className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 outline-none focus:border-zinc-700"
                value={aiForm}
                onChange={(e) => setAiForm(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Kadar Patchouli Alcohol (PA)</label>
              <input
                type="text"
                className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 outline-none focus:border-zinc-700"
                value={aiPaLevel}
                onChange={(e) => setAiPaLevel(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Lokasi Panen & Asal</label>
              <input
                type="text"
                className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 outline-none focus:border-zinc-700"
                value={aiOrigin}
                onChange={(e) => setAiOrigin(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Profil Sensori Aroma</label>
              <input
                type="text"
                className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 outline-none focus:border-zinc-700"
                value={aiAroma}
                onChange={(e) => setAiAroma(e.target.value)}
              />
            </div>

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isAiGenerating}
              className="w-full h-10 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              {isAiGenerating ? "Menyusun Deskripsi..." : "Generate Deskripsi"}
            </Button>
          </div>

          {/* AI Result Container */}
          <div className="border border-zinc-800 rounded-2xl bg-zinc-950 p-4.5 flex flex-col justify-between min-h-[260px] shadow-inner">
            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">AI Generated Draft</span>
              {isAiGenerating ? (
                <div className="space-y-2 pt-4 animate-pulse">
                  <div className="h-3 w-full rounded bg-zinc-800" />
                  <div className="h-3 w-11/12 rounded bg-zinc-800" />
                  <div className="h-3 w-4/5 rounded bg-zinc-800" />
                </div>
              ) : displayedAiOutput ? (
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                  {displayedAiOutput}
                  <span className="inline-block w-1.5 h-3 bg-emerald-500 ml-0.5 animate-pulse" />
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center pt-8 text-center text-zinc-500 gap-2">
                  <Info className="h-5 w-5" />
                  <p className="text-xs leading-relaxed max-w-[200px]">Isi parameter di kiri lalu klik tombol generate untuk melihat draf wewangian.</p>
                </div>
              )}
            </div>

            {displayedAiOutput && !isAiGenerating && (
              <button
                onClick={handleCopy}
                className="self-end mt-4 text-[10px] font-bold text-zinc-300 hover:text-white transition-all uppercase tracking-wider flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Tersalin" : "Salin Deskripsi"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] border border-zinc-800 bg-zinc-900 p-6 shadow-2xl relative text-zinc-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-base font-bold font-serif-accent italic mb-5 text-zinc-100">
              Tambah Produk B2C Baru
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Nama Produk</label>
                <input
                  type="text"
                  required
                  className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 focus:border-zinc-700 outline-none"
                  placeholder="Contoh: Sabun Mandi Herbal Nilam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 focus:border-zinc-700 outline-none"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Stok Awal</label>
                  <input
                    type="number"
                    required
                    className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 focus:border-zinc-700 outline-none"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Kategori Produk</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 focus:border-zinc-700 outline-none cursor-pointer"
                >
                  <option value="essential-oils">Minyak Atsiri (Essential Oils)</option>
                  <option value="body-care">Perawatan Tubuh (Body Care)</option>
                  <option value="home-fragrance">Pengharum Ruangan</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-zinc-800 hover:bg-zinc-850 text-zinc-300 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft font-bold cursor-pointer transition-all"
                >
                  Simpan Produk
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
