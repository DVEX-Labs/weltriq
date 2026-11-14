import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import { readCompanyInfo, writeCompanyInfo, CompanyInfo } from "@/lib/company/db";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const info = await readCompanyInfo();
    return NextResponse.json({ info });
  } catch (error) {
    console.error("Error reading company info:", error);
    return NextResponse.json({ error: "Failed to read company information." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<CompanyInfo>;

    if (!body.phone?.trim() && !body.whatsapp?.trim()) {
      return NextResponse.json(
        { error: "At least one contact phone or WhatsApp number is required." },
        { status: 400 }
      );
    }

    const current = await readCompanyInfo();
    const updated: CompanyInfo = {
      ...current,
      ...body,
      companyName: body.companyName?.trim() || current.companyName,
      address: body.address?.trim() || current.address,
      phone: body.phone?.trim() || current.phone,
      phoneSecondary: body.phoneSecondary?.trim() ?? current.phoneSecondary,
      email: body.email?.trim() || current.email,
      whatsapp: body.whatsapp?.trim() || current.whatsapp,
      whatsappDefaultMessage: body.whatsappDefaultMessage?.trim() || current.whatsappDefaultMessage,
      workingHours: body.workingHours?.trim() || current.workingHours,
      mapEmbedUrl: body.mapEmbedUrl?.trim() ?? current.mapEmbedUrl,
      mapDirectionsUrl: body.mapDirectionsUrl?.trim() || current.mapDirectionsUrl,
    };

    const saved = await writeCompanyInfo(updated);
    return NextResponse.json({
      success: true,
      message: "Company profile and contact details updated successfully.",
      info: saved,
    });
  } catch (error) {
    console.error("Error updating company info:", error);
    return NextResponse.json({ error: "Failed to update company information." }, { status: 500 });
  }
}

