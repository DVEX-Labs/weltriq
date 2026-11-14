import fs from "fs";
import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { CompanyInfo } from "./types";
import defaultCompanyInfo from "@/data/company-info.json";

export * from "./types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "company-info.json");
let writeLock = Promise.resolve();

export async function readCompanyInfo(): Promise<CompanyInfo> {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return defaultCompanyInfo as CompanyInfo;
    }
    const data = await fs.promises.readFile(DATA_FILE_PATH, "utf8");
    return JSON.parse(data || "{}") as CompanyInfo;
  } catch (error) {
    console.error("Error reading company info:", error);
    return defaultCompanyInfo as CompanyInfo;
  }
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

  const op = async () => {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    const tempFile = `${DATA_FILE_PATH}.${Date.now()}.${crypto.randomBytes(4).toString("hex")}.tmp`;
    await fs.promises.writeFile(tempFile, JSON.stringify(updatedInfo, null, 2), "utf8");
    await fs.promises.rename(tempFile, DATA_FILE_PATH);
  };

  writeLock = writeLock.then(op, op);
  await writeLock;

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

