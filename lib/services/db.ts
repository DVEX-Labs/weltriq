import path from "path";
import { revalidatePath } from "next/cache";
import {
  getSupabaseAdmin,
  assertWritableStorageAvailable,
  isSeedCompleted,
  markSeedCompleted,
  readLocalJsonFile,
  writeLocalJsonFile,
} from "@/lib/storage/supabase";
import {
  ManagedService,
  CreateServiceInput,
  UpdateServiceInput,
  MAX_DESCRIPTION_LENGTH,
} from "./types";

export * from "./types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "services.json");
const SEED_KEY = "services_seeded";

interface ServiceRow {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

function rowToService(row: ServiceRow): ManagedService {
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    description: row.description,
    image: row.image,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serviceToRow(s: ManagedService): ServiceRow {
  return {
    id: s.id,
    number: s.number,
    title: s.title,
    description: s.description,
    image: s.image,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  };
}

function revalidateServiceRoutes(): void {
  try {
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin");
    revalidatePath("/admin/services");
  } catch {
    // ignore outside request context
  }
}

export async function readAllServices(): Promise<ManagedService[]> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("number", { ascending: true });

    if (error) {
      console.error("Supabase read services error:", error.message);
      throw new Error(`Database error reading services: ${error.message}`);
    }

    if (data && data.length > 0) {
      return (data as ServiceRow[]).map(rowToService);
    }

    const alreadySeeded = await isSeedCompleted(supabase, SEED_KEY);
    if (!alreadySeeded) {
      const seed = await readLocalJsonFile<ManagedService[]>(DATA_FILE_PATH, []);
      if (seed.length > 0) {
        const { error: seedError } = await supabase
          .from("services")
          .upsert(seed.map(serviceToRow), { onConflict: "id" });
        if (seedError) {
          console.error("Supabase seed services error:", seedError.message);
        }
      }
      await markSeedCompleted(supabase, SEED_KEY);
      return seed;
    }

    return [];
  }

  return readLocalJsonFile<ManagedService[]>(DATA_FILE_PATH, []);
}

function generateServiceId(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getServiceById(id: string): Promise<ManagedService | null> {
  const all = await readAllServices();
  return all.find((s) => s.id === id) || null;
}

export async function createService(input: CreateServiceInput): Promise<ManagedService> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

  const all = await readAllServices();
  const trimmedTitle = input.title.trim();
  const trimmedDesc = input.description.trim();

  if (!trimmedTitle) {
    throw new Error("Service title is required.");
  }
  if (!trimmedDesc) {
    throw new Error("Service description is required.");
  }
  if (trimmedDesc.length > MAX_DESCRIPTION_LENGTH) {
    throw new Error(`Description exceeds maximum allowed limit of ${MAX_DESCRIPTION_LENGTH} characters.`);
  }

  const baseId = input.id?.trim() || generateServiceId(trimmedTitle);
  let id = baseId;
  let counter = 1;
  while (all.some((s) => s.id === id)) {
    id = `${baseId}-${counter}`;
    counter++;
  }

  const now = new Date().toISOString();
  const nextNumInt = all.length + 1;
  const nextNumber = String(nextNumInt).padStart(2, "0");

  let finalNumber = nextNumber;
  let swappedService: ManagedService | null = null;
  if (input.number) {
    const parsed = parseInt(input.number, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const desiredNumber = String(parsed).padStart(2, "0");
      const conflictIndex = all.findIndex((s) => s.number === desiredNumber);
      if (conflictIndex !== -1) {
        all[conflictIndex].number = nextNumber;
        all[conflictIndex].updatedAt = now;
        swappedService = all[conflictIndex];
      }
      finalNumber = desiredNumber;
    }
  }

  const newService: ManagedService = {
    id,
    number: finalNumber,
    title: trimmedTitle,
    description: trimmedDesc,
    image: input.image || "/images/service_images/metal_roofing_structure.jpg",
    createdAt: now,
    updatedAt: now,
  };

  if (supabase) {
    if (swappedService) {
      const { error: swapErr } = await supabase
        .from("services")
        .update({ number: swappedService.number, updated_at: swappedService.updatedAt })
        .eq("id", swappedService.id);
      if (swapErr) {
        throw new Error(`Failed to reorder existing service: ${swapErr.message}`);
      }
    }

    const { error } = await supabase.from("services").insert(serviceToRow(newService));
    if (error) {
      throw new Error(`Failed to create service: ${error.message}`);
    }
    await markSeedCompleted(supabase, SEED_KEY);
  } else {
    all.push(newService);
    all.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
    await writeLocalJsonFile<ManagedService[]>(DATA_FILE_PATH, all);
  }

  revalidateServiceRoutes();
  return newService;
}

export async function updateService(input: UpdateServiceInput): Promise<ManagedService> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

  const all = await readAllServices();
  const index = all.findIndex((s) => s.id === input.id);

  if (index === -1) {
    throw new Error(`Service with id "${input.id}" not found.`);
  }

  const current = all[index];
  const now = new Date().toISOString();

  let updatedDescription = current.description;
  if (input.description !== undefined) {
    const trimmed = input.description.trim();
    if (!trimmed) {
      throw new Error("Service description cannot be empty.");
    }
    if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(`Description exceeds maximum allowed limit of ${MAX_DESCRIPTION_LENGTH} characters.`);
    }
    updatedDescription = trimmed;
  }

  let updatedNumber = current.number;
  let swappedService: ManagedService | null = null;
  if (input.number !== undefined) {
    const parsedNum = parseInt(input.number, 10);
    if (!isNaN(parsedNum) && parsedNum > 0) {
      const targetNumberStr = String(parsedNum).padStart(2, "0");
      const oldNumberStr = current.number;

      if (targetNumberStr !== oldNumberStr) {
        const conflictingIndex = all.findIndex((s) => s.id !== current.id && s.number === targetNumberStr);
        if (conflictingIndex !== -1) {
          all[conflictingIndex].number = oldNumberStr;
          all[conflictingIndex].updatedAt = now;
          swappedService = all[conflictingIndex];
        }
        updatedNumber = targetNumberStr;
      }
    }
  }

  const updatedService: ManagedService = {
    ...current,
    title: input.title?.trim() || current.title,
    description: updatedDescription,
    image: input.image?.trim() || current.image,
    number: updatedNumber,
    updatedAt: now,
  };

  if (supabase) {
    if (swappedService) {
      const { error: swapErr } = await supabase
        .from("services")
        .update({ number: swappedService.number, updated_at: swappedService.updatedAt })
        .eq("id", swappedService.id);
      if (swapErr) {
        throw new Error(`Failed to swap service sequence: ${swapErr.message}`);
      }
    }

    const { error } = await supabase
      .from("services")
      .update(serviceToRow(updatedService))
      .eq("id", current.id);
    if (error) {
      throw new Error(`Failed to update service: ${error.message}`);
    }
  } else {
    all[index] = updatedService;
    all.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
    await writeLocalJsonFile<ManagedService[]>(DATA_FILE_PATH, all);
  }

  revalidateServiceRoutes();
  return updatedService;
}

export async function deleteService(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

  const all = await readAllServices();
  const filtered = all.filter((s) => s.id !== id);

  if (filtered.length === all.length) {
    return false;
  }

  const renumbered = filtered.map((s, idx) => ({
    ...s,
    number: String(idx + 1).padStart(2, "0"),
  }));

  if (supabase) {
    const { error: delErr } = await supabase.from("services").delete().eq("id", id);
    if (delErr) {
      throw new Error(`Failed to delete service: ${delErr.message}`);
    }

    if (renumbered.length > 0) {
      const { error: renumberErr } = await supabase
        .from("services")
        .upsert(renumbered.map(serviceToRow), { onConflict: "id" });
      if (renumberErr) {
        console.warn("Failed to renumber remaining services:", renumberErr.message);
      }
    }
  } else {
    await writeLocalJsonFile<ManagedService[]>(DATA_FILE_PATH, renumbered);
  }

  revalidateServiceRoutes();
  return true;
}
