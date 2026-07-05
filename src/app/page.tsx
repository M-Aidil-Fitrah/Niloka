import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import {
  ArrowRightIcon,
  CartIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";
import { SectionShell } from "@/components/ui/section-shell";
import {
  previewCategories,
  previewPrimitives,
  previewProducts,
} from "@/lib/design-preview";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream-50">
      <section className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[620px] overflow-hidden rounded-lg bg-brand-950 text-white-soft">
          <Image
            alt="Produk aromaterapi natural sebagai arah visual marketplace NILOKA."
            className="object-cover opacity-80"
            fill
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/70 to-brand-900/15" />
          <div className="relative flex min-h-[620px] flex-col p-4 sm:p-6 lg:p-8">
            <header className="flex items-center justify-between gap-4">
              <nav
                aria-label="Navigasi utama"
                className="hidden items-center gap-6 text-sm font-medium md:flex"
              >
                <a href="#shop">Shop</a>
                <a href="#passport">Nilam Passport</a>
                <a href="#circular">Ampas Nilam</a>
              </nav>
              <p className="text-xl font-semibold">NILOKA</p>
              <div className="flex items-center gap-2">
                <label className="hidden h-10 w-64 items-center gap-2 rounded-full bg-white-soft px-4 text-sm text-ink-600 shadow-sm md:flex">
                  <SearchIcon className="text-brand-700" />
                  <span className="sr-only">Cari produk</span>
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink-600"
                    placeholder="Search product..."
                    type="search"
                  />
                </label>
                <IconButton label="Buka keranjang">
                  <CartIcon />
                </IconButton>
                <IconButton label="Buka akun">
                  <UserIcon />
                </IconButton>
              </div>
            </header>

            <div className="mt-auto grid gap-8 pb-4 pt-24 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
              <div className="max-w-2xl">
                <Badge tone="light">Curated Aceh patchouli marketplace</Badge>
                <h1 className="mt-5 text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
                  Nilam Aceh
                  <span className="font-accent italic"> curated</span> for
                  modern wellness.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white-soft/85 sm:text-base">
                  Fondasi visual NILOKA mengarah ke marketplace premium:
                  image-led, ringan, responsive, dan siap dipasangkan dengan
                  kontrak data typed.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button>
                    Shop now <ArrowRightIcon />
                  </Button>
                  <Button variant="secondary">Explore rules</Button>
                </div>
              </div>
              <Card className="border-white/20 bg-white/20 p-5 text-white-soft backdrop-blur">
                <p className="text-sm font-semibold">Design baseline</p>
                <p className="mt-8 text-5xl font-semibold">96%</p>
                <p className="mt-2 text-sm leading-5 text-white-soft/80">
                  Responsive, typed, image-led, and performance-first.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        accent="foundation"
        description="Komponen ini adalah preview kecil untuk memastikan token, typography, cards, buttons, dan section rhythm sudah siap sebelum fitur marketplace lengkap."
        eyebrow="Design system"
        title="Reusable UI"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {previewPrimitives.map((primitive) => (
            <Card className="p-5" key={primitive.id}>
              <Badge tone="gold">{primitive.label}</Badge>
              <p className="mt-4 text-sm leading-6 text-ink-600">
                {primitive.description}
              </p>
            </Card>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        accent="routes"
        description="Kategori ini akan menjadi titik masuk untuk branch fitur berikutnya: katalog, passport, AromaMatch AI, dan ekosistem sirkular."
        eyebrow="Marketplace map"
        title="Core feature"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {previewCategories.map((category) => (
            <Card
              className="flex min-h-40 flex-col justify-between p-5 transition-colors hover:border-brand-700"
              key={category.id}
            >
              <h3 className="text-lg font-semibold text-brand-950">
                {category.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                {category.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-800">
                Explore <ArrowRightIcon />
              </span>
            </Card>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        accent="cards"
        description="Product cards dibuat stabil dengan aspect ratio, image optimization, badge, harga, dan action yang siap dipakai katalog."
        eyebrow="Product pattern"
        id="shop"
        title="Curated product"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {previewProducts.map((product) => (
            <Card className="overflow-hidden" key={product.id}>
              <div className="relative aspect-[4/3] bg-cream-100">
                <Image
                  alt={product.imageAlt}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 384px, (min-width: 768px) 33vw, 100vw"
                  src={product.imageUrl}
                />
                <Badge className="absolute left-4 top-4" tone="light">
                  {product.tag}
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-brand-950">
                  {product.label}
                </h3>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink-900">
                    {product.price}
                  </p>
                  <Button size="sm">
                    <CartIcon /> Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SectionShell>

      <section
        className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8"
        id="circular"
      >
        <div className="relative min-h-72 overflow-hidden rounded-lg bg-brand-900">
          <Image
            alt="Bahan alami dan proses produksi untuk ekonomi sirkular nilam."
            className="object-cover opacity-75"
            fill
            sizes="(min-width: 1024px) 680px, 100vw"
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-brand-900/10" />
          <div className="relative max-w-md p-6 text-white-soft sm:p-8">
            <Badge tone="light">B2B circular economy</Badge>
            <h2 className="mt-5 text-3xl font-semibold">
              Ampas nilam sebagai
              <span className="font-accent italic"> nilai baru</span>.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white-soft/80">
              Area ini akan berkembang menjadi listing B2B dengan kondisi,
              kuantitas, lokasi, harga/kg, tag penggunaan, dan disclaimer klaim
              seller.
            </p>
          </div>
        </div>
        <Card className="p-6 sm:p-8" id="passport">
          <Badge tone="gold">Nilam Passport</Badge>
          <h2 className="mt-5 text-3xl font-semibold text-brand-950">
            Transparansi produk tanpa klaim sertifikasi resmi.
          </h2>
          <p className="mt-4 text-sm leading-6 text-ink-600">
            Panel ini menjadi pola awal untuk asal bahan baku, profil aroma,
            fungsi, cara pakai, catatan keamanan, dan status validasi admin.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
            <span className="rounded-lg bg-cream-100 p-3">Asal bahan baku</span>
            <span className="rounded-lg bg-cream-100 p-3">Profil aroma</span>
            <span className="rounded-lg bg-cream-100 p-3">Cara pakai</span>
            <span className="rounded-lg bg-cream-100 p-3">Catatan aman</span>
          </div>
        </Card>
      </section>
    </main>
  );
}
