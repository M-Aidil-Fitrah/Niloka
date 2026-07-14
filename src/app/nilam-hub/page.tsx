import { HubShell } from "@/components/community/hub-shell";
import { getCommunityPostsDto } from "@/lib/dal/community-dal";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nilam Hub - Komunitas & Forum Penjual, Petani & Konsumen - NILOKA",
  description:
    "Diskusikan budidaya tanaman nilam, bagikan panen dan produk, tulis ulasan pengalaman, cari tahu info harga ampas nilam di Nilam Hub.",
};

type NilamHubPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
    sort?: string;
  }>;
};

export default async function NilamHubPage({ searchParams }: NilamHubPageProps) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();

  const searchQuery = params.search || "";
  const category = params.category || "all";
  const location = params.location || "all";
  const sortBy = (params.sort as "newest" | "likes" | "replies") || "newest";

  const posts = await getCommunityPostsDto({
    searchQuery,
    category,
    location,
    sortBy,
    currentUserId: currentUser?.id ?? null,
  });

  return (
    <HubShell
      posts={posts}
      currentUser={currentUser}
      initialSearch={searchQuery}
      initialCategory={category}
      initialLocation={location}
      initialSort={sortBy}
    />
  );
}
