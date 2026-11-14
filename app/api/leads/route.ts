import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import { readAllLeads, saveLead, deleteLead, updateLeadStatus } from "@/lib/leads/db";

// Public endpoint to save lead silently from website
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, district, service, message, source } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Name and phone number are required." },
        { status: 400 }
      );
    }

    const saved = await saveLead({
      name,
      phone,
      district,
      service,
      message,
      source,
    });

    return NextResponse.json({ success: true, lead: saved }, { status: 201 });
  } catch (error: unknown) {
    console.error("Save lead error:", error);
    return NextResponse.json(
      { error: "Failed to record inquiry." },
      { status: 500 }
    );
  }
}

// Admin only: Get all recorded leads
export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const leads = await readAllLeads();
  return NextResponse.json({ leads });
}

// Admin only: Delete a lead
export async function DELETE(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Lead ID is required." }, { status: 400 });
  }

  const deleted = await deleteLead(id);
  return NextResponse.json({ success: deleted });
}

// Admin only: Update lead status
export async function PATCH(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required." }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update lead status." }, { status: 500 });
  }
}

