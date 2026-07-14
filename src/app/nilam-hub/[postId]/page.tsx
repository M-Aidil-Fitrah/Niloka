import { notFound } from "next/navigation";
import { PostDetail } from "@/components/community/post-detail";
import { getCurrentUser } from "@/lib/auth/session";
import { getCommunityPostByIdDto } from "@/lib/dal/community-dal";

export const dynamic = "force-dynamic";

type NilamHubPostPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export async function generateMetadata({ params }: NilamHubPostPageProps) {
  const { postId } = await params;
  const post = await getCommunityPostByIdDto({ postId });

  if (!post) {
    return {
      title: "Diskusi tidak ditemukan - Nilam Hub - NILOKA",
    };
  }

  return {
    title: `${post.title || "Diskusi Komunitas"} - Nilam Hub - NILOKA`,
    description: post.content.slice(0, 160),
  };
}

export default async function NilamHubPostPage({ params }: NilamHubPostPageProps) {
  const { postId } = await params;
  const currentUser = await getCurrentUser();
  const post = await getCommunityPostByIdDto({
    postId,
    currentUserId: currentUser?.id ?? null,
  });

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} currentUser={currentUser} />;
}
