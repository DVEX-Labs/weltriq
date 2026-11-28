import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import { isServerlessReadOnlyEnv } from "@/lib/storage/kv";

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

    // Production / Cloud: Use Vercel Blob when configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`blogs/${filename}`, buffer, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url, success: true });
    }

    if (isServerlessReadOnlyEnv()) {
      return NextResponse.json(
        {
          error:
            "Vercel Blob storage is not connected. Add a Blob Store in your Vercel Storage dashboard to upload images on the live site.",
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
