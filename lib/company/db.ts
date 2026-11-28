import path from "path";
import { revalidatePath } from "next/cache";
import { readJsonStore, writeJsonStore } from "@/lib/storage/kv";
import { CompanyInfo } from "./types";
import defaultCompanyInfo from "@/data/company-info.json";

export * from "./types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "company-info.json");
const REDIS_KEY = "weltriq:company";

export async function readCompanyInfo(): Promise<CompanyInfo> {
  return readJsonStore<CompanyInfo>(REDIS_KEY, DATA_FILE_PATH, defaultCompanyInfo as CompanyInfo);
}

export async function writeCompanyInfo(info: CompanyInfo): Promise<CompanyInfo> {
  // Automatically derive clean whatsapp digits from whatsapp phone (strip spaces, symbols, plus)
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

  await writeJsonStore<CompanyInfo>(REDIS_KEY, DATA_FILE_PATH, updatedInfo);

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

