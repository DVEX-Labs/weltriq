import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import {
  readAllServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
} from "@/lib/services/db";

export async function GET(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const service = await getServiceById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }
    return NextResponse.json({ service });
  }

  const services = await readAllServices();
  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, image, id, number } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Service title is required." }, { status: 400 });
    }
    if (!description?.trim()) {
      return NextResponse.json({ error: "Service description is required." }, { status: 400 });
    }
    if (description.trim().length > 160) {
      return NextResponse.json({ error: "Description must not exceed 160 characters." }, { status: 400 });
    }
    if (!image?.trim()) {
      return NextResponse.json({ error: "Service image is required." }, { status: 400 });
    }

    const created = await createService({ title, description, image, id, number });
    return NextResponse.json({ service: created }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create service error:", error);
    const message = error instanceof Error ? error.message : "Failed to create service.";
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
      return NextResponse.json({ error: "Service ID is required." }, { status: 400 });
    }
    if (body.description && body.description.trim().length > 160) {
      return NextResponse.json({ error: "Description must not exceed 160 characters." }, { status: 400 });
    }

    const updated = await updateService(body);
    return NextResponse.json({ service: updated });
  } catch (error: unknown) {
    console.error("Update service error:", error);
    const message = error instanceof Error ? error.message : "Failed to update service.";
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
    return NextResponse.json({ error: "Service ID is required." }, { status: 400 });
  }

  const success = await deleteService(id);
  if (!success) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Service deleted successfully." });
}

