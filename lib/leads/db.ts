import path from "path";
import crypto from "crypto";
import {
  getSupabaseAdmin,
  assertWritableStorageAvailable,
  isSeedCompleted,
  markSeedCompleted,
  readLocalJsonFile,
  writeLocalJsonFile,
} from "@/lib/storage/supabase";
import { LeadEnquiry, CreateLeadInput } from "./types";

export * from "./types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "leads.json");
const SEED_KEY = "leads_seeded";

interface LeadRow {
  id: string;
  name: string;
  phone: string;
  district: string | null;
  service: string | null;
  message: string | null;
  source: LeadEnquiry["source"];
  status: LeadEnquiry["status"];
  created_at: string;
}

function rowToLead(row: LeadRow): LeadEnquiry {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    district: row.district ?? undefined,
    service: row.service ?? undefined,
    message: row.message ?? undefined,
    source: row.source,
    status: row.status,
    createdAt: row.created_at,
  };
}

function leadToRow(lead: LeadEnquiry): LeadRow {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    district: lead.district ?? null,
    service: lead.service ?? null,
    message: lead.message ?? null,
    source: lead.source,
    status: lead.status,
    created_at: lead.createdAt,
  };
}

export async function readAllLeads(): Promise<LeadEnquiry[]> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase read leads error:", error.message);
      throw new Error(`Database error reading leads: ${error.message}`);
    }

    if (data && data.length > 0) {
      return (data as LeadRow[]).map(rowToLead);
    }

    const alreadySeeded = await isSeedCompleted(supabase, SEED_KEY);
    if (!alreadySeeded) {
      const seed = await readLocalJsonFile<LeadEnquiry[]>(DATA_FILE_PATH, []);
      if (seed.length > 0) {
        const { error: seedError } = await supabase
          .from("leads")
          .upsert(seed.map(leadToRow), { onConflict: "id" });
        if (seedError) {
          console.error("Supabase seed leads error:", seedError.message);
        }
      }
      await markSeedCompleted(supabase, SEED_KEY);
      return seed;
    }

    return [];
  }

  return readLocalJsonFile<LeadEnquiry[]>(DATA_FILE_PATH, []);
}

export async function saveLead(input: CreateLeadInput): Promise<LeadEnquiry> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

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

  if (supabase) {
    const { error } = await supabase.from("leads").insert(leadToRow(newLead));
    if (error) {
      throw new Error(`Failed to save lead: ${error.message}`);
    }
    await markSeedCompleted(supabase, SEED_KEY);
    return newLead;
  }

  const all = await readAllLeads();
  all.unshift(newLead);
  await writeLocalJsonFile<LeadEnquiry[]>(DATA_FILE_PATH, all);

  return newLead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      throw new Error(`Failed to delete lead: ${error.message}`);
    }

    return Boolean(data && data.length > 0);
  }

  const all = await readAllLeads();
  const filtered = all.filter((l) => l.id !== id);

  if (filtered.length === all.length) {
    return false;
  }

  await writeLocalJsonFile<LeadEnquiry[]>(DATA_FILE_PATH, filtered);
  return true;
}

export async function updateLeadStatus(
  id: string,
  status: LeadEnquiry["status"]
): Promise<LeadEnquiry | null> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update lead status: ${error.message}`);
    }

    return data ? rowToLead(data as LeadRow) : null;
  }

  const all = await readAllLeads();
  const lead = all.find((l) => l.id === id);
  if (!lead) return null;

  lead.status = status;
  await writeLocalJsonFile<LeadEnquiry[]>(DATA_FILE_PATH, all);
  return lead;
}
