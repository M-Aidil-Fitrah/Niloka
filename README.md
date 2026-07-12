# NILOKA

NILOKA (Nilam Integrated Local Agro Marketplace) adalah aplikasi marketplace digital untuk ekosistem nilam Aceh. Aplikasi ini menggabungkan katalog produk nilam B2C, marketplace ampas nilam B2B, Nilam Passport sebagai identitas transparansi produk, dashboard seller, panel admin, checkout, payment Midtrans Core, dan fitur AI untuk rekomendasi serta asistensi konten.

Project ini dibangun sebagai aplikasi full-stack Next.js App Router dengan PostgreSQL, Prisma, NextAuth, Server Actions, Route Handlers, dan DAL server-only.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Stack Teknologi](#stack-teknologi)
- [Arsitektur Singkat](#arsitektur-singkat)
- [Struktur Folder](#struktur-folder)
- [Prasyarat](#prasyarat)
- [Setup Lokal](#setup-lokal)
- [Environment Variables](#environment-variables)
- [Database dan Seed](#database-dan-seed)
- [Akun Demo](#akun-demo)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Scripts](#scripts)
- [Route Aplikasi](#route-aplikasi)
- [API dan Server Actions](#api-dan-server-actions)
- [Auth dan Authorization](#auth-dan-authorization)
- [Upload File](#upload-file)
- [AI](#ai)
- [Payment](#payment)
- [Quality Gate](#quality-gate)
- [Workflow Development](#workflow-development)
- [Dokumentasi Internal](#dokumentasi-internal)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Fitur Utama

### Marketplace Produk Nilam

- Katalog produk nilam siap pakai seperti essential oil, roll-on, sabun, diffuser, parfum, body oil, dan bundle.
- Halaman detail produk dengan seller, harga, stok, review, dan ringkasan Nilam Passport.
- Filter dan katalog berbasis DTO dari data PostgreSQL melalui DAL Prisma.

### Marketplace Ampas Nilam

- Listing ampas nilam untuk kebutuhan B2B dan ekonomi sirkular.
- Informasi kondisi ampas, kuantitas, harga per kilogram, lokasi, proses penyulingan, dan tag penggunaan.
- Disclaimer bahwa tag penggunaan adalah klaim seller dan bukan verifikasi kualitas oleh platform.

### Nilam Passport

- Sistem identitas dan transparansi produk.
- Berisi asal bahan baku, jenis produk, profil aroma, fungsi, cara pakai, catatan keamanan, dan status validasi.
- Diposisikan sebagai transparansi produk, bukan sertifikasi resmi.

### Auth, Role, dan Dashboard

- Login email/password memakai NextAuth Credentials Provider.
- Register buyer melalui Server Action.
- Role pengguna: `buyer`, `seller`, dan `admin`.
- Dashboard seller untuk produk, ampas, passport, promo, order, dan ringkasan keuangan.
- Panel admin untuk validation queue, seller, user, order, audit log, dan statistik.

### Cart, Checkout, dan Order

- Cart authenticated disimpan di database.
- Checkout membuat order dan payment record.
- Halaman order history dan detail order.
- Seller dapat memproses dan mengirim order.

### Payment Midtrans Core

- Integrasi Midtrans Core API berada di server boundary.
- Mendukung payment method seperti QRIS, virtual account, e-wallet, dan manual transfer sesuai implementasi service.
- Endpoint status payment untuk polling dari UI custom payment.
- Webhook Midtrans tersedia untuk update status payment/order.

### AI Features

- Chatbot NILOKA.
- Product description generator untuk seller.
- Provider AI memakai Gemini sebagai provider utama dan Groq sebagai fallback opsional.
- Secret AI hanya dibaca server-side.

### Upload Gambar

- Upload gambar diproses server-side.
- Maksimal 2 MB sebelum konversi.
- Input image dikonversi ke WebP dengan Sharp.
- File disimpan di `storage/uploads`, sedangkan metadata disimpan di tabel `UploadedAsset`.
- Public path dilayani melalui route `/uploads/[...path]`.

## Stack Teknologi

- Next.js `16.2.9` dengan App Router.
- React `19.2.4`.
- TypeScript.
- Tailwind CSS.
- Prisma `7.8.0` dengan generated client di `src/generated/prisma`.
- PostgreSQL.
- NextAuth `4.24.14` dengan Prisma Adapter dan Credentials Provider.
- Zod untuk validasi input.
- bcryptjs untuk password hashing.
- Sharp untuk image processing.
- Midtrans client untuk payment.
- Gemini/Groq API untuk AI.
- GSAP dan Lenis untuk animasi/interaction tertentu.
- Lucide React untuk icon.

## Arsitektur Singkat

NILOKA memakai pola backend-for-frontend di dalam Next.js App Router.

- Server Components membaca data melalui DAL di `src/lib/dal`.
- Client Components menerima DTO typed, bukan Prisma model mentah.
- Mutasi internal UI memakai Server Actions di `src/lib/actions`.
- Endpoint integrasi atau boundary publik memakai Route Handlers di `src/app/api`.
- Auth helper berada di `src/lib/auth/session.ts`.
- Prisma client dan secret hanya boleh dipakai di modul server-only.
- Data contoh statis tidak dipakai sebagai fallback untuk fitur yang sudah dimigrasi ke database.

Alur sederhana:

```txt
UI Route / Component
  -> Server Component atau Client Component
  -> DAL / Server Action / Route Handler
  -> Prisma
  -> PostgreSQL
```

## Struktur Folder

```txt
.
|-- prisma/
|   |-- schema.prisma
|   |-- seed.ts
|   `-- fixtures.ts
|-- scripts/
|   |-- API.md
|   |-- BACKEND.md
|   |-- DATABASE.md
|   |-- DESIGN.md
|   |-- PLAN.md
|   |-- PROJECT.md
|   `-- RULES.md
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |-- auth/
|   |   |-- products/
|   |   |-- ampas/
|   |   |-- seller/
|   |   |-- admin/
|   |   |-- checkout/
|   |   |-- orders/
|   |   `-- uploads/
|   |-- components/
|   |-- context/
|   |-- generated/prisma/
|   |-- lib/
|   |   |-- actions/
|   |   |-- ai/
|   |   |-- auth/
|   |   |-- dal/
|   |   |-- db/
|   |   |-- services/
|   |   `-- uploads/
|   `-- types/
|-- storage/uploads/
|-- .env.example
`-- package.json
```

## Prasyarat

- Node.js versi modern yang kompatibel dengan Next.js 16.
- pnpm `11.10.0`.
- PostgreSQL lokal atau database PostgreSQL lain yang dapat diakses.
- Credential opsional untuk Gemini/Groq dan Midtrans jika ingin memakai fitur AI/payment asli.

Project ini tidak memakai Docker sebagai default development path. Database lokal langsung adalah asumsi utama.

## Setup Lokal

1. Install dependencies.

```bash
pnpm install
```

2. Siapkan file env lokal.

```bash
cp .env.example .env
```

3. Buat database PostgreSQL.

```bash
createdb niloka
```

4. Sesuaikan `DATABASE_URL` di `.env` jika username, password, host, atau port PostgreSQL berbeda.

5. Validasi dan generate Prisma.

```bash
pnpm db:validate
pnpm db:generate
```

6. Jalankan migration.

```bash
pnpm db:migrate
```

7. Isi data demo.

```bash
pnpm db:seed
```

8. Jalankan dev server.

```bash
pnpm dev
```

9. Buka aplikasi.

```txt
http://localhost:3000
```

## Environment Variables

Contoh env tersedia di `.env.example`.

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/niloka?schema=public"
AUTH_SECRET="replace-with-random-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-random-secret"
NEXTAUTH_URL="http://localhost:3000"

UPLOAD_MAX_IMAGE_BYTES="2097152"
UPLOAD_PUBLIC_PREFIX="/uploads"

# AI primary: Gemini
GEMINI_API_KEY=""
GEMINI_TEXT_MODEL="gemini-3.1-flash-lite"
GEMINI_VISION_MODEL="gemini-3.5-flash"

# AI fallback: Groq
GROQ_API_KEY=""
GROQ_TEXT_MODEL="llama-3.3-70b-versatile"
GROQ_VISION_MODEL="llama-3.2-11b-vision-preview"

# Legacy optional fallback, sementara
GEMINI_MODEL=""
GROQ_FALLBACK_MODEL=""

MIDTRANS_SERVER_KEY=""
MIDTRANS_CLIENT_KEY=""
MIDTRANS_IS_PRODUCTION="false"
```

Catatan:

- `.env` tidak boleh di-commit.
- `DATABASE_URL`, `NEXTAUTH_SECRET`, dan `MIDTRANS_SERVER_KEY` divalidasi oleh `src/lib/env.ts` pada flow yang memakai env validation.
- AI tetap bisa dikembangkan tanpa API key, tetapi route AI dapat mengembalikan error/fallback aman sesuai implementasi.
- Untuk development tanpa payment asli, isi `MIDTRANS_SERVER_KEY` dengan nilai dummy hanya jika flow yang dijalankan membutuhkan env tersebut.

## Database dan Seed

Database memakai PostgreSQL dan Prisma. Schema utama ada di `prisma/schema.prisma`.

Model penting:

- Auth: `User`, `Account`, `Session`, `VerificationToken`.
- Marketplace: `Seller`, `ProductCategory`, `Product`, `ProductImage`, `NilamPassport`, `AmpasListing`.
- Commerce: `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `OrderFulfillment`.
- Platform: `Review`, `Promo`, `Bundle`, `Article`, `ChatThread`, `ChatMessage`, `AdminValidationItem`, `AuditLog`, `UploadedAsset`.

Seed:

- File seed: `prisma/seed.ts`.
- Fixture demo: `prisma/fixtures.ts`.
- Seed melakukan operasi destructive untuk data demo dan hanya aman secara default di localhost/127.0.0.1.
- Untuk environment non-local, seed akan ditolak kecuali `ALLOW_DESTRUCTIVE_SEED=true`.

Perintah database:

```bash
pnpm db:validate
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

Untuk deployment atau server:

```bash
pnpm db:deploy
```

## Akun Demo

Setelah `pnpm db:seed`, akun demo berikut tersedia:

| Role | Email | Password |
| --- | --- | --- |
| Buyer | `buyer@niloka.com` | `niloka123` |
| Seller | `seller@niloka.com` | `niloka123` |
| Admin | `admin@niloka.com` | `niloka123` |

## Menjalankan Aplikasi

Development:

```bash
pnpm dev
```

Production build:

```bash
pnpm build
pnpm start
```

Typecheck:

```bash
pnpm typecheck
```

Lint:

```bash
pnpm lint
```

Full check:

```bash
pnpm check
```

## Scripts

| Script | Fungsi |
| --- | --- |
| `pnpm dev` | Menjalankan Next.js dev server. |
| `pnpm build` | Membuat production build. |
| `pnpm start` | Menjalankan build production. |
| `pnpm lint` | Menjalankan ESLint. |
| `pnpm typecheck` | Menjalankan TypeScript tanpa emit. |
| `pnpm check` | Menjalankan lint, typecheck, dan build. |
| `pnpm db:validate` | Validasi Prisma schema. |
| `pnpm db:generate` | Generate Prisma client. |
| `pnpm db:migrate` | Jalankan migration development. |
| `pnpm db:deploy` | Deploy migration untuk environment server. |
| `pnpm db:seed` | Isi database dengan data demo. |
| `pnpm db:reset` | Reset database development lokal. Gunakan hati-hati. |
| `pnpm db:studio` | Membuka Prisma Studio. |

## Route Aplikasi

Route publik:

- `/` - landing dan marketplace homepage.
- `/products` - katalog produk nilam.
- `/products/[slug]` - detail produk.
- `/ampas` - katalog ampas nilam.
- `/ampas/[slug]` - detail ampas.
- `/passport` - halaman Nilam Passport.
- `/bundles` - bundle produk.
- `/artikel` - daftar artikel.
- `/artikel/[slug]` - detail artikel.
- `/auth/login` - login.
- `/auth/register` - register.

Route authenticated:

- `/checkout` - checkout.
- `/orders` - order history.
- `/orders/[orderId]` - detail order.
- `/chat` - chat.
- `/apply-seller` - pengajuan menjadi seller.

Route role-based:

- `/seller` - dashboard seller.
- `/admin` - panel admin.

Route file:

- `/uploads/[...path]` - serving file upload WebP dari storage lokal.

## API dan Server Actions

Route Handlers:

- `GET/POST /api/auth/[...nextauth]` - NextAuth.
- `POST /api/ai/chat` - chatbot AI.
- `POST /api/ai/product-description` - generator deskripsi produk.
- `GET /api/admin/product-count` - endpoint admin.
- `GET /api/payments/[orderId]/status` - polling status payment/order.
- `POST /api/payments/webhook` - webhook Midtrans.
- `GET /uploads/[...path]` - file upload.

Server Actions utama:

- Auth: `registerBuyerAction`.
- Seller application: `submitSellerApplicationAction`.
- Product: `saveProductAction`, `deleteProductAction`, `getSellerProductsAction`.
- Ampas: `saveAmpasListingAction`, `deleteAmpasListingAction`, `getSellerAmpasListingsAction`.
- Passport: `savePassportAction`, `getSellerPassportsAction`.
- Promo: `savePromoAction`, `deletePromoAction`, `getSellerPromosAction`.
- Cart/checkout: `fetchCartAction`, `addToCartAction`, `updateCartItemQuantityAction`, `removeFromCartAction`, `checkoutAction`.
- Order: `fetchOrderHistoryAction`, `confirmPaymentAction`, seller order actions.
- Admin: validation approve/reject, dashboard stats, users, orders, audit logs.
- Chat: thread read/create/send/delete actions.
- Review: `submitReviewAction`.

## Auth dan Authorization

Auth implementation:

- Config utama: `src/auth.ts`.
- Route NextAuth: `src/app/api/auth/[...nextauth]/route.ts`.
- Client provider: `src/context/auth-context.tsx`.
- Password helper: `src/lib/auth/password.ts`.
- Validation schema: `src/lib/auth/schemas.ts`.
- Session helper: `src/lib/auth/session.ts`.

Role helper:

- `getCurrentUser()` untuk auth nullable.
- `requireUser()` untuk user login.
- `requireSeller()` untuk seller dan ownership-sensitive workflow.
- `requireAdmin()` untuk admin panel dan admin API.

Prinsip:

- Authorization tidak cukup dilakukan di navbar atau Client Component.
- Role check harus dekat dengan data source atau mutation.
- Field sensitif seperti `passwordHash`, token, payment secret, dan audit internal tidak dikirim ke UI.

## Upload File

Upload diproses oleh helper di `src/lib/uploads/image-upload.ts`.

Aturan:

- File wajib image.
- Maksimal file mengikuti `UPLOAD_MAX_IMAGE_BYTES`, default 2 MB.
- Format diterima mengikuti validasi image di helper.
- Output dikonversi ke WebP.
- File fisik masuk ke `storage/uploads`.
- Public path memakai `UPLOAD_PUBLIC_PREFIX`, default `/uploads`.
- Path publik harus berasal dari server, bukan input bebas client.

Jika ingin memindahkan storage ke object storage di masa depan, UI tetap sebaiknya membaca `publicPath` dari DTO.

## AI

Provider AI berada di `src/lib/ai`.

Environment:

- `GEMINI_API_KEY`
- `GEMINI_TEXT_MODEL`
- `GEMINI_VISION_MODEL`
- `GROQ_API_KEY`
- `GROQ_TEXT_MODEL`
- `GROQ_VISION_MODEL`
- `GEMINI_MODEL` (legacy optional)
- `GROQ_FALLBACK_MODEL`

Route AI:

- `/api/ai/chat`
- `/api/ai/product-description`
- `/api/diagnose`

Prinsip:

- API key tidak boleh masuk client bundle.
- Input harus melewati guardrail dan validasi.
- Rekomendasi atau konteks produk dibaca dari DAL, bukan data contoh statis.

## Payment

Payment service berada di `src/lib/services/payment-service.ts`.

Environment:

- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION`

Route payment:

- `/api/payments/[orderId]/status`
- `/api/payments/webhook`

Prinsip:

- Server key hanya dipakai server-side.
- Client tidak membuat charge langsung ke Midtrans.
- Payment status dicek melalui server endpoint.
- Webhook memverifikasi signature sebelum update status.

## Quality Gate

Sebelum handoff branch, jalankan:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Atau agregasi:

```bash
pnpm check
```

Jika check gagal, catat file dan penyebabnya. Jangan menutupi error lint/type/build dengan perubahan yang tidak terkait.

## Workflow Development

Aturan kerja project ada di `scripts/RULES.md` dan `scripts/PLAN.md`.

Ringkasan:

- Untuk pekerjaan backend/integrasi, gunakan branch dari `dev` terbaru.
- `main` diperlakukan sebagai production branch dan tidak disentuh kecuali diminta.
- Jangan commit otomatis kecuali diminta eksplisit.
- Jangan melakukan destructive git operation tanpa instruksi eksplisit.
- Jika mengubah kode Next.js, baca dokumentasi Next lokal yang relevan di `node_modules/next/dist/docs/`.
- Data contoh statis yang sudah digantikan DB tidak boleh dipertahankan sebagai fallback fitur tersebut.

## Dokumentasi Internal

Dokumen project yang perlu dibaca sebelum kontribusi besar:

- `scripts/PROJECT.md` - konteks produk dan bisnis NILOKA.
- `scripts/RULES.md` - aturan engineering.
- `scripts/DESIGN.md` - arahan visual dan UX.
- `scripts/PLAN.md` - roadmap dan workflow branch.
- `scripts/BACKEND.md` - panduan backend.
- `scripts/DATABASE.md` - panduan PostgreSQL dan Prisma.
- `scripts/API.md` - kontrak API dan action.

## Troubleshooting

### Database tidak ditemukan

Pastikan database sudah dibuat:

```bash
createdb niloka
```

Lalu cek `DATABASE_URL` di `.env`.

### Prisma client belum sesuai schema

Jalankan:

```bash
pnpm db:generate
```

### Seed ditolak di environment non-local

Seed sengaja dilindungi dari destructive run. Untuk environment yang memang aman dan disengaja:

```bash
ALLOW_DESTRUCTIVE_SEED=true pnpm db:seed
```

### AI route error karena key kosong

Isi minimal salah satu:

```bash
GEMINI_API_KEY=""
GROQ_API_KEY=""
```

Jika keduanya kosong, fitur AI dapat mengembalikan error/fallback aman.

### Payment error karena Midtrans key kosong

Isi `MIDTRANS_SERVER_KEY` untuk flow payment yang memanggil Midtrans. Gunakan sandbox key untuk development.

## License

Project ini bersifat private.
