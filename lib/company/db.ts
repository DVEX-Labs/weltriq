import path from "path";
import { revalidatePath } from "next/cache";
import {
  getSupabaseAdmin,
  assertWritableStorageAvailable,
  readLocalJsonFile,
  writeLocalJsonFile,
} from "@/lib/storage/supabase";
import { CompanyInfo } from "./types";
import defaultCompanyInfo from "@/data/company-info.json";

export * from "./types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "company-info.json");
const ROW_ID = "default";

interface CompanyInfoRow {
  id: string;
  company_name: string;
  tagline: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  phone_secondary: string;
  email: string;
  whatsapp: string;
  whatsapp_number: string | null;
  whatsapp_default_message: string;
  working_hours: string;
  map_embed_url: string | null;
  map_directions_url: string;
  website: string;
  updated_at?: string;
}

function rowToCompanyInfo(row: CompanyInfoRow): CompanyInfo {
  return {
    companyName: row.company_name,
    tagline: row.tagline,
    address: row.address,
    city: row.city,
    district: row.district,
    state: row.state,
    pincode: row.pincode,
    phone: row.phone,
    phoneSecondary: row.phone_secondary,
    email: row.email,
    whatsapp: row.whatsapp,
    whatsappNumber: row.whatsapp_number ?? undefined,
    whatsappDefaultMessage: row.whatsapp_default_message,
    workingHours: row.working_hours,
    mapEmbedUrl: row.map_embed_url ?? "",
    mapDirectionsUrl: row.map_directions_url,
    website: row.website,
  };
}

function companyInfoToRow(info: CompanyInfo): CompanyInfoRow {
  return {
    id: ROW_ID,
    company_name: info.companyName,
    tagline: info.tagline,
    address: info.address,
    city: info.city,
    district: info.district,
    state: info.state,
    pincode: info.pincode,
    phone: info.phone,
    phone_secondary: info.phoneSecondary,
    email: info.email,
    whatsapp: info.whatsapp,
    whatsapp_number: info.whatsappNumber ?? null,
    whatsapp_default_message: info.whatsappDefaultMessage,
    working_hours: info.workingHours,
    map_embed_url: info.mapEmbedUrl ?? "",
    map_directions_url: info.mapDirectionsUrl,
    website: info.website,
    updated_at: new Date().toISOString(),
  };
}

export async function readCompanyInfo(): Promise<CompanyInfo> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("company_info")
      .select("*")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) {
      console.error("Supabase read company_info error:", error.message);
      return defaultCompanyInfo as CompanyInfo;
    }

    if (data) {
      return rowToCompanyInfo(data as CompanyInfoRow);
    }

    // Seed once from bundled company-info.json
    const seed = await readLocalJsonFile<CompanyInfo>(
      DATA_FILE_PATH,
      defaultCompanyInfo as CompanyInfo
    );
    const { error: seedError } = await supabase
      .from("company_info")
      .upsert(companyInfoToRow(seed), { onConflict: "id" });

    if (seedError) {
      console.warn("Supabase seed company_info warning:", seedError.message);
    }

    return seed;
  }

  return readLocalJsonFile<CompanyInfo>(DATA_FILE_PATH, defaultCompanyInfo as CompanyInfo);
}

export async function writeCompanyInfo(info: CompanyInfo): Promise<CompanyInfo> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

  const rawDigits = (info.whatsapp || "").replace(/[^0-9]/g, "");
  const normalizedNumber = rawDigits.startsWith("91")
    ? rawDigits
    : rawDigits
    ? `91${rawDigits}`
    : "918136983928";

  const updatedInfo: CompanyInfo = {
    ...info,
    whatsappNumber: normalizedNumber,
  };

  if (supabase) {
    const { error } = await supabase
      .from("company_info")
      .upsert(companyInfoToRow(updatedInfo), { onConflict: "id" });
    if (error) {
      throw new Error(`Failed to update company info: ${error.message}`);
    }
  } else {
    await writeLocalJsonFile<CompanyInfo>(DATA_FILE_PATH, updatedInfo);
  }

  try {
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/services");
    revalidatePath("/admin/company-info");
  } catch {
    // revalidatePath might throw if called outside a request context
  }

  return updatedInfo;
}
