import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import {
  getSupabaseAdmin,
  isServerlessReadOnlyEnv,
  MEDIA_BUCKET,
} from "@/lib/storage/supabase";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 5MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extension mapping
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const safeBase = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);

    const randomSuffix = crypto.randomBytes(4).toString("hex");
    const filename = `${safeBase || "image"}-${Date.now()}-${randomSuffix}.${ext}`;

    // Production / Cloud: Use Supabase Storage bucket "weltriq-media"
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const storagePath = `blogs/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
          cacheControl: "31536000",
        });

      if (uploadError) {
        console.error("Supabase Storage upload error:", uploadError);
        return NextResponse.json(
          { error: `Supabase image upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(storagePath);

      return NextResponse.json({ url: publicUrlData.publicUrl, success: true });
    }

    if (isServerlessReadOnlyEnv()) {
      return NextResponse.json(
        {
          error:
            "Supabase is not connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel to upload images on the live site.",
        },
        { status: 500 }
      );
    }

    // Local development fallback: save under public/uploads/blogs
    const uploadDir = path.join(process.cwd(), "public", "uploads", "blogs");
    if (!fs.existsSync(uploadDir)) {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/blogs/${filename}`;
    return NextResponse.json({ url: publicUrl, success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "An error occurred while uploading the file." },
      { status: 500 }
    );
  }
}
