import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import {
  getAllArticlesAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/blog/db";

export async function GET(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const articles = await getAllArticlesAdmin({ status, search });
  return NextResponse.json({ articles });
}

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, content, category, coverImage } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Article title is required." }, { status: 400 });
    }
    if (!excerpt?.trim()) {
      return NextResponse.json({ error: "Article excerpt is required." }, { status: 400 });
    }
    if (!content?.trim()) {
      return NextResponse.json({ error: "Article content is required." }, { status: 400 });
    }
    if (!category?.trim()) {
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }
    if (!coverImage?.trim()) {
      return NextResponse.json({ error: "Cover image is required." }, { status: 400 });
    }

    const created = await createArticle(body);
    return NextResponse.json({ article: created }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create article error:", error);
    const message = error instanceof Error ? error.message : "Failed to create article.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Article ID is required." }, { status: 400 });
    }

    const updated = await updateArticle(body);
    return NextResponse.json({ article: updated });
  } catch (error: unknown) {
    console.error("Update article error:", error);
    const message = error instanceof Error ? error.message : "Failed to update article.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Article ID is required." }, { status: 400 });
  }

  const success = await deleteArticle(id);
  if (!success) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Article deleted successfully." });
}
