import "server-only";

import { prisma } from "@/lib/db/prisma";
import { CommunityCategory, Prisma } from "@/generated/prisma/client";

export type CommunityCommentDto = {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    isFarmer: boolean;
    image: string | null;
    sellerVerified: boolean;
  };
  replies?: CommunityCommentDto[];
};

export type CommunityDiagnoseResultDto = {
  diagnosis?: string;
  confidence?: number;
  kemungkinanTambahan?: string;
  penyebab?: string;
  alasan?: string;
  rekomendasi?: string[];
  timestamp?: string | number | Date;
  [key: string]: unknown;
};

export type CommunityPostDto = {
  id: string;
  title: string | null;
  content: string;
  images: string[];
  category: string;
  location: string | null;
  diagnoseResult: CommunityDiagnoseResultDto | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    isFarmer: boolean;
    image: string | null;
    sellerVerified: boolean;
  };
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
  comments: CommunityCommentDto[];
};

const communityPostDtoInclude = {
  author: {
    select: {
      id: true,
      name: true,
      role: true,
      isFarmer: true,
      image: true,
      seller: {
        select: {
          verificationStatus: true,
        },
      },
    },
  },
  likes: {
    select: {
      userId: true,
    },
  },
  comments: {
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          isFarmer: true,
          image: true,
          seller: {
            select: {
              verificationStatus: true,
            },
          },
        },
      },
    },
  },
} as const satisfies Prisma.CommunityPostInclude;

type CommunityPostWithDtoRelations = Prisma.CommunityPostGetPayload<{
  include: typeof communityPostDtoInclude;
}>;

function mapCommunityPostToDto(
  post: CommunityPostWithDtoRelations,
  currentUserId?: string | null
): CommunityPostDto {
  const likesCount = post.likes.length;
  const likedByCurrentUser = currentUserId
    ? post.likes.some((l) => l.userId === currentUserId)
    : false;

  const allCommentsMapped: CommunityCommentDto[] = post.comments.map((c) => ({
    id: c.id,
    postId: c.postId,
    userId: c.userId,
    parentId: c.parentId,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    author: {
      id: c.user.id,
      name: c.user.name ?? "Pengguna NILOKA",
      role: c.user.role,
      isFarmer: c.user.isFarmer,
      image: c.user.image,
      sellerVerified: c.user.seller?.verificationStatus === "VERIFIED",
    },
    replies: [],
  }));

  const rootComments = allCommentsMapped.filter((c) => c.parentId === null);
  const replyComments = allCommentsMapped.filter((c) => c.parentId !== null);

  replyComments.forEach((reply) => {
    const parent = rootComments.find((p) => p.id === reply.parentId);
    if (parent) {
      parent.replies = parent.replies || [];
      parent.replies.push(reply);
    } else {
      rootComments.push(reply);
    }
  });

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    images: post.images,
    category: post.category,
    location: post.location,
    diagnoseResult: post.diagnoseResult as CommunityDiagnoseResultDto | null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: {
      id: post.author.id,
      name: post.author.name ?? "Pengguna NILOKA",
      role: post.author.role,
      isFarmer: post.author.isFarmer,
      image: post.author.image,
      sellerVerified: post.author.seller?.verificationStatus === "VERIFIED",
    },
    likesCount,
    commentsCount: post.comments.length,
    likedByCurrentUser,
    comments: rootComments,
  };
}

export async function getCommunityPostsDto(options: {
  searchQuery?: string;
  category?: string; // Enum string or "all"
  location?: string; // City string or "all"
  sortBy?: "newest" | "likes" | "replies";
  currentUserId?: string | null;
}): Promise<CommunityPostDto[]> {
  const { searchQuery, category, location, sortBy = "newest", currentUserId } = options;

  // Build prisma filter conditions
  const where: Prisma.CommunityPostWhereInput = {};

  // 1. Search Query (matches title or content)
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }

  // 2. Category Filter
  if (category && category !== "all") {
    where.category = category as CommunityCategory;
  }

  // 3. Location Filter
  if (location && location !== "all") {
    where.location = { equals: location, mode: "insensitive" };
  }

  // Build sorting order
  let orderBy: Prisma.CommunityPostOrderByWithRelationInput = { createdAt: "desc" };
  if (sortBy === "likes") {
    orderBy = { likes: { _count: "desc" } };
  } else if (sortBy === "replies") {
    orderBy = { comments: { _count: "desc" } };
  }

  const posts = await prisma.communityPost.findMany({
    where,
    orderBy,
    include: communityPostDtoInclude,
  });

  return posts.map((post) => mapCommunityPostToDto(post, currentUserId));
}

export async function getCommunityPostByIdDto(options: {
  postId: string;
  currentUserId?: string | null;
}): Promise<CommunityPostDto | null> {
  const post = await prisma.communityPost.findUnique({
    where: { id: options.postId },
    include: communityPostDtoInclude,
  });

  if (!post) return null;

  return mapCommunityPostToDto(post, options.currentUserId);
}

export async function getUserPastDiagnoses(): Promise<unknown[]> {
  // Wait, let's check how plant diagnoses are logged in the database, if at all!
  // In `plant-diagnose.ts` and `diagnose/route.ts` we saw that diagnose results are NOT saved in the database currently!
  // Oh! Let's double check if they are saved.
  // In `schema.prisma`, there is no AI diagnose table.
  // So how does a user share their AI Diagnose result?
  // They can share a diagnosis they JUST ran on the article/diagnose widget (which can be passed in state/session storage),
  // OR we can store their diagnosis results in window.localStorage on the client-side!
  // Storing recent diagnosis results in client-side localStorage is extremely simple, robust, and doesn't require database tables!
  // So when they open the post creation modal, we can load their recent diagnoses from localStorage and allow them to attach one!
  // That's an excellent design choice, very robust, and requires zero extra DB overhead.
  // Therefore, we don't need a database query for past diagnoses here, we'll handle it client-side.
  return [];
}
