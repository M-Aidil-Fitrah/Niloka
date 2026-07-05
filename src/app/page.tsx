import Image from "next/image";
import { LandingMotion } from "@/components/landing/landing-motion";
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
import {
  bestSellerProducts,
  categoryTiles,
  circularUses,
  footerColumns,
  passportItems,
  storyMetrics,
} from "@/lib/landing-data";

export default function Home() {
  return (
    <LandingMotion>
      <main className="min-h-screen overflow-hidden bg-cream-50 text-ink-900">
        <section className="page-shell pt-3">
          <div className="hero-card landing-hero relative min-h-[680px] overflow-hidden rounded-lg bg-brand-950 text-white-soft">
            <Image
              alt="Koleksi produk aromaterapi dan kosmetik natural sebagai visual utama NILOKA."
              className="object-cover opacity-75"
              fill
              priority
              sizes="100vw"
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2200&q=85"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(214,170,91,0.22),transparent_28%),linear-gradient(90deg,rgba(23,34,23,0.96),rgba(32,52,31,0.72),rgba(32,52,31,0.1))]" />

            <div className="relative flex min-h-[680px] flex-col p-4 sm:p-5 lg:p-7">
              <header className="landing-nav grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <nav
                  aria-label="Navigasi utama"
                  className="hidden items-center gap-6 text-sm font-semibold md:flex"
                >
                  <a href="#products">Shop</a>
                  <a href="#passport">Nilam Passport</a>
                  <a href="#circular">Ampas Nilam</a>
                </nav>

                <a className="text-xl font-bold tracking-normal" href="#">
                  NILOKA
                </a>

                <div className="flex items-center justify-end gap-2">
                  <label className="hidden h-11 w-[min(30vw,360px)] items-center gap-2 rounded-full bg-white-soft px-4 text-sm text-ink-600 shadow-sm lg:flex">
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

              <div className="mt-auto grid gap-7 pb-3 pt-28 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
                <div className="max-w-4xl">
                  <Badge className="hero-reveal" tone="light">
                    Aceh patchouli curated marketplace
                  </Badge>
                  <h1 className="hero-title mt-5 max-w-4xl text-6xl font-bold leading-[0.9] sm:text-7xl lg:text-8xl xl:text-9xl">
                    Nilam Aceh
                    <span className="font-accent italic"> autentik</span>,
                    dari hulu ke hilir.
                  </h1>
                  <p className="hero-copy mt-6 max-w-2xl text-base font-medium leading-7 text-white-soft/82 sm:text-lg">
                    Marketplace terkurasi untuk produk turunan nilam Aceh,
                    rekomendasi AromaMatch AI, Nilam Passport, dan transaksi B2B
                    ampas nilam dalam satu ekosistem digital.
                  </p>
                  <div className="hero-actions mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button>
                      Jelajahi Produk <ArrowRightIcon />
                    </Button>
                    <Button variant="secondary">Cek Nilam Passport</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-8">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Explore NILOKA</p>
              <h2 className="section-title">
                Satu platform untuk
                <span className="font-accent italic text-brand-700"> nilam Aceh</span>.
              </h2>
            </div>
            <p className="section-copy">
              Dari produk siap pakai untuk konsumen sampai ampas nilam untuk
              pelaku usaha, semua dirancang transparan, terkurasi, dan mudah
              dikembangkan ke backend PostgreSQL nanti.
            </p>
          </div>

          <div className="category-strip grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {categoryTiles.map((category) => (
              <a
                className="category-card group relative min-h-72 overflow-hidden rounded-lg bg-brand-900 text-white-soft"
                href={category.id === "ampas" ? "#circular" : "#passport"}
                key={category.id}
              >
                <Image
                  alt={category.imageAlt}
                  className="object-cover opacity-72 transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  src={category.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/45 to-transparent" />
                <div className="relative flex min-h-72 flex-col justify-end p-5">
                  <Badge tone="light">{category.label}</Badge>
                  <p className="mt-3 text-sm leading-6 text-white-soft/82">
                    {category.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="page-shell py-8" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Curated products</p>
              <h2 className="section-title">
                Best sellers
                <span className="font-accent italic text-brand-700"> NILOKA</span>.
              </h2>
            </div>
            <p className="section-copy">
              Produk turunan nilam Aceh disiapkan dengan card stabil, harga
              jelas, badge kecil, dan action belanja yang siap dipakai untuk
              katalog penuh.
            </p>
          </div>

          <div className="product-grid grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {bestSellerProducts.map((product) => (
              <Card className="product-card overflow-hidden" key={product.id}>
                <div className="relative aspect-[4/3] bg-cream-100">
                  <Image
                    alt={product.imageAlt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    src={product.imageUrl}
                  />
                  <Badge className="absolute left-4 top-4" tone="light">
                    {product.tag}
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-brand-950">
                    {product.name}
                  </h3>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-ink-900">
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
        </section>

        <section className="page-shell grid gap-3 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="story-panel reveal-block relative min-h-[520px] overflow-hidden rounded-lg bg-brand-950 text-white-soft">
            <Image
              alt="Botol minyak atsiri sebagai representasi kualitas nilam Aceh."
              className="object-cover opacity-68"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1600&q=85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/72 to-brand-950/12" />
            <div className="relative flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
              <Badge tone="light">Why NILOKA</Badge>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
                  Nilam Aceh bukan sekadar komoditas mentah.
                </h2>
                <p className="mt-5 text-sm leading-7 text-white-soft/82 sm:text-base">
                  NILOKA memindahkan nilai tambah ke ekosistem lokal:
                  mempertemukan UMKM, penyuling, pembeli, dan pelaku usaha B2B
                  dalam pengalaman digital yang jelas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {storyMetrics.map((metric) => (
              <Card className="metric-card p-6 sm:p-8" key={metric.id}>
                <p className="text-5xl font-bold text-brand-950">
                  {metric.value}
                </p>
                <p className="mt-4 max-w-md text-sm leading-6 text-ink-600">
                  {metric.label}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-shell grid gap-3 py-8 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="reveal-block p-6 sm:p-8" id="passport">
            <Badge tone="gold">Nilam Passport</Badge>
            <h2 className="mt-5 text-4xl font-bold leading-tight text-brand-950 sm:text-5xl">
              Transparansi produk tanpa klaim sertifikasi resmi.
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink-600">
              Setiap produk dapat menampilkan asal bahan baku, profil aroma,
              fungsi, cara pakai, dan catatan keamanan yang divalidasi admin
              sebelum dipublikasikan.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
              {passportItems.map((item) => (
                <div className="rounded-lg bg-cream-100 p-4" key={item.id}>
                  <p className="font-bold text-brand-950">{item.label}</p>
                  <p className="mt-1 text-ink-600">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <div
            className="reveal-block relative min-h-[500px] overflow-hidden rounded-lg bg-brand-900 text-white-soft"
            id="circular"
          >
            <Image
              alt="Bahan alami dan minyak nilam sebagai bagian dari ekonomi sirkular."
              className="object-cover opacity-70"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/70 to-transparent" />
            <div className="relative flex min-h-[500px] flex-col justify-between p-6 sm:p-8">
              <div>
                <Badge tone="light">Ekonomi sirkular B2B</Badge>
                <h2 className="mt-5 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                  Ampas nilam menjadi
                  <span className="font-accent italic"> bahan bernilai</span>.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white-soft/82">
                  Penyuling dapat membuat listing ampas dengan kondisi,
                  kuantitas, harga/kg, lokasi, dan tag potensi penggunaan.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {circularUses.map((item) => (
                  <Badge key={item.id} tone="light">
                    {item.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-8">
          <div className="reveal-block rounded-lg bg-brand-950 px-6 py-12 text-center text-white-soft sm:px-10 lg:px-16">
            <p className="eyebrow text-gold-500">AromaMatch AI</p>
            <h2 className="mx-auto mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
              Dari kebutuhan pengguna ke rekomendasi produk nilam yang relevan.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white-soft/75 sm:text-base">
              Wizard empat langkah akan membaca tujuan penggunaan, preferensi
              aroma, bentuk produk, dan budget. Hasilnya berupa grid rekomendasi
              dengan alasan singkat.
            </p>
            <div className="mt-8">
              <Button variant="secondary">
                Mulai AromaMatch <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </section>

        <footer className="mt-8 border-t border-line bg-[#f1efed]">
          <div className="page-shell py-12">
            <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
              <div>
                <p className="max-w-lg text-sm font-bold leading-6 text-ink-900">
                  Join our newsletter to follow NILOKA product drops, seller
                  onboarding, and circular economy updates.
                </p>
                <form className="mt-6 flex max-w-xl flex-col gap-3 rounded-full bg-white-soft p-2 sm:flex-row">
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email newsletter
                  </label>
                  <input
                    className="min-h-12 flex-1 rounded-full bg-transparent px-5 text-sm outline-none placeholder:text-ink-600"
                    id="newsletter-email"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button className="min-w-36">Subscribe</Button>
                </form>
                <p className="mt-4 text-xs leading-5 text-ink-600">
                  By subscribing, you agree to receive updates from NILOKA.
                </p>
                <div className="mt-8 flex gap-3">
                  {["Fb", "Ig", "In", "Yt"].map((label) => (
                    <a
                      aria-label={`NILOKA ${label}`}
                      className="flex size-9 items-center justify-center rounded-full border border-line text-xs font-bold text-brand-900"
                      href="#"
                      key={label}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-3">
                {footerColumns.map((column) => (
                  <div key={column.id}>
                    <h3 className="text-sm font-bold text-ink-900">
                      {column.title}
                    </h3>
                    <ul className="mt-5 space-y-4 text-sm text-ink-700">
                      {column.links.map((link) => (
                        <li key={link}>
                          <a href="#">{link}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <p className="footer-word mt-14 text-[22vw] font-black leading-[0.72] text-[#df4f27] sm:text-[20vw] lg:text-[18vw]">
              niloka
            </p>
          </div>
        </footer>
      </main>
    </LandingMotion>
  );
}
