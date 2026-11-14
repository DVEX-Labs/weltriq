import fs from "fs";
import path from "path";
import crypto from "crypto";
import { LeadEnquiry, CreateLeadInput } from "./types";

export * from "./types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "leads.json");
let writeLock = Promise.resolve();

export async function readAllLeads(): Promise<LeadEnquiry[]> {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return [];
    }
    const data = await fs.promises.readFile(DATA_FILE_PATH, "utf8");
    return JSON.parse(data || "[]") as LeadEnquiry[];
  } catch (error) {
    console.error("Error reading leads data:", error);
    return [];
  }
}

async function writeAllLeads(leads: LeadEnquiry[]): Promise<void> {
  const op = async () => {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    const tempFile = `${DATA_FILE_PATH}.${Date.now()}.${crypto.randomBytes(4).toString("hex")}.tmp`;
    await fs.promises.writeFile(tempFile, JSON.stringify(leads, null, 2), "utf8");
    await fs.promises.rename(tempFile, DATA_FILE_PATH);
  };

  writeLock = writeLock.then(op, op);
  return writeLock;
}

export async function saveLead(input: CreateLeadInput): Promise<LeadEnquiry> {
  const all = await readAllLeads();

  const newLead: LeadEnquiry = {
    id: `lead-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    name: input.name.trim(),
    phone: input.phone.trim(),
    district: input.district?.trim() || "Kerala",
    service: input.service?.trim() || "Roofing Consultation",
    message: input.message?.trim() || "",
    source: input.source || "Contact Form",
    createdAt: new Date().toISOString(),
    status: "new",
  };

  // Prepend newest leads to top
  all.unshift(newLead);
  await writeAllLeads(all);

  return newLead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const all = await readAllLeads();
  const filtered = all.filter((l) => l.id !== id);

  if (filtered.length === all.length) {
    return false;
  }

  await writeAllLeads(filtered);
  return true;
}

export async function updateLeadStatus(
  id: string,
  status: LeadEnquiry["status"]
): Promise<LeadEnquiry | null> {
  const all = await readAllLeads();
  const lead = all.find((l) => l.id === id);
  if (!lead) return null;

  lead.status = status;
  await writeAllLeads(all);
  return lead;
}

