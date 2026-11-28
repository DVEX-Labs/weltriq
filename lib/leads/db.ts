import path from "path";
import crypto from "crypto";
import { readJsonStore, writeJsonStore } from "@/lib/storage/kv";
import { LeadEnquiry, CreateLeadInput } from "./types";

export * from "./types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "leads.json");
const REDIS_KEY = "weltriq:leads";

export async function readAllLeads(): Promise<LeadEnquiry[]> {
  return readJsonStore<LeadEnquiry[]>(REDIS_KEY, DATA_FILE_PATH, []);
}

async function writeAllLeads(leads: LeadEnquiry[]): Promise<void> {
  return writeJsonStore<LeadEnquiry[]>(REDIS_KEY, DATA_FILE_PATH, leads);
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

