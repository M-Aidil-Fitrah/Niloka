"use server";

import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CommunityCategory } from "@/generated/prisma/client";
import { storeImageAsWebp } from "@/lib/uploads/image-upload";

const postSchema = z.object({
  title: z.string().trim().max(100, "Judul maksimal 100 karakter.").optional(),
  content: z.string().trim().min(10, "Konten minimal 10 karakter."),
  category: z.nativeEnum(CommunityCategory, {
    message: "Kategori wajib dipilih.",
  }),
  location: z.string().trim().optional(),
  diagnoseResult: z.string().optional(), // JSON string representing DiagnoseResult
});

export async function createPostAction(
  formData: FormData
): Promise<{ ok: boolean; message: string; postId?: string }> {
  try {
    const user = await requireUser();

    // Extract text fields
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();
    const category = formData.get("category")?.toString();
    const location = formData.get("location")?.toString();
    const diagnoseResultStr = formData.get("diagnoseResult")?.toString();

    // Validate using Zod
    const validated = postSchema.safeParse({
      title: title || undefined,
      content,
      category,
      location: location || undefined,
      diagnoseResult: diagnoseResultStr || undefined,
    });

    if (!validated.success) {
      return {
        ok: false,
        message: validated.error.issues[0]?.message ?? "Input tidak valid.",
      };
    }

    const data = validated.data;

    // Handle uploaded image files
    const images: string[] = [];
    const imageFiles = formData.getAll("images") as File[];

    for (const file of imageFiles) {
      // Check if it is a valid file upload (not empty string)
      if (file && file.size > 0 && file.name) {
        try {
          const stored = await storeImageAsWebp(file, "community");
          images.push(stored.publicPath);
        } catch (uploadError) {
          console.error("Failed to upload community image:", uploadError);
          return {
            ok: false,
            message: uploadError instanceof Error ? uploadError.message : "Gagal mengunggah gambar.",
          };
        }
      }
    }

    // Parse AI DiagnoseResult JSON if attached
    let parsedDiagnose: any = null;
    if (data.diagnoseResult) {
      try {
        parsedDiagnose = JSON.parse(data.diagnoseResult);
      } catch (e) {
        console.error("Failed to parse diagnose result JSON:", e);
      }
    }

    // Create the post
    const post = await prisma.communityPost.create({
      data: {
        title: data.title || null,
        content: data.content,
        category: data.category,
        location: data.location || null,
        diagnoseResult: parsedDiagnose || undefined,
        images,
        authorId: user.id,
      },
    });

    revalidatePath("/nilam-hub");

    return {
      ok: true,
      message: "Postingan Anda berhasil dibagikan ke Nilam Hub!",
      postId: post.id,
    };
  } catch (error) {
    console.error("Error in createPostAction:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan internal.",
    };
  }
}

export async function likePostAction(
  postId: string
): Promise<{ ok: boolean; message: string; liked?: boolean }> {
  try {
    const user = await requireUser();

    // Check if like exists
    const existingLike = await prisma.communityLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.communityLike.delete({
        where: {
          postId_userId: {
            postId,
            userId: user.id,
          },
        },
      });
      revalidatePath("/nilam-hub");
      return { ok: true, message: "Batal menyukai.", liked: false };
    } else {
      // Like
      await prisma.communityLike.create({
        data: {
          postId,
          userId: user.id,
        },
      });
      revalidatePath("/nilam-hub");
      return { ok: true, message: "Menyukai postingan.", liked: true };
    }
  } catch (error) {
    console.error("Error in likePostAction:", error);
    return { ok: false, message: "Gagal memproses tombol suka." };
  }
}

export async function commentPostAction(
  postId: string,
  content: string,
  parentId?: string
): Promise<{ ok: boolean; message: string }> {
  try {
    const user = await requireUser();

    if (!content || content.trim().length < 2) {
      return { ok: false, message: "Komentar minimal 2 karakter." };
    }

    // If parentId is provided, check if that comment exists
    if (parentId) {
      const parentComment = await prisma.communityComment.findUnique({
        where: { id: parentId },
        select: { id: true, parentId: true },
      });

      if (!parentComment) {
        return { ok: false, message: "Komentar utama tidak ditemukan." };
      }

      // Restrict nesting to 1-level: if parent already has a parent, reply directly to the root parent
      const finalParentId = parentComment.parentId || parentComment.id;

      await prisma.communityComment.create({
        data: {
          postId,
          userId: user.id,
          content: content.trim(),
          parentId: finalParentId,
        },
      });
    } else {
      await prisma.communityComment.create({
        data: {
          postId,
          userId: user.id,
          content: content.trim(),
        },
      });
    }

    revalidatePath("/nilam-hub");
    return { ok: true, message: "Komentar berhasil dikirim." };
  } catch (error) {
    console.error("Error in commentPostAction:", error);
    return { ok: false, message: "Gagal mengirimkan komentar." };
  }
}

export async function deletePostAction(
  postId: string
): Promise<{ ok: boolean; message: string }> {
  try {
    const user = await requireUser();

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return { ok: false, message: "Postingan tidak ditemukan." };
    }

    // Check if author or admin
    if (post.authorId !== user.id && user.role !== "admin") {
      return { ok: false, message: "Anda tidak berhak menghapus postingan ini." };
    }

    await prisma.communityPost.delete({
      where: { id: postId },
    });

    revalidatePath("/nilam-hub");
    return { ok: true, message: "Postingan berhasil dihapus." };
  } catch (error) {
    console.error("Error in deletePostAction:", error);
    return { ok: false, message: "Gagal menghapus postingan." };
  }
}
