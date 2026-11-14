import fs from "fs";
import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import {
  ManagedService,
  CreateServiceInput,
  UpdateServiceInput,
  MAX_DESCRIPTION_LENGTH,
} from "./types";

export * from "./types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "services.json");
let writeLock = Promise.resolve();

export async function readAllServices(): Promise<ManagedService[]> {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return [];
    }
    const data = await fs.promises.readFile(DATA_FILE_PATH, "utf8");
    return JSON.parse(data || "[]") as ManagedService[];
  } catch (error) {
    console.error("Error reading services data:", error);
    return [];
  }
}

async function writeAllServices(services: ManagedService[]): Promise<void> {
  const op = async () => {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    const tempFile = `${DATA_FILE_PATH}.${Date.now()}.${crypto.randomBytes(4).toString("hex")}.tmp`;
    await fs.promises.writeFile(tempFile, JSON.stringify(services, null, 2), "utf8");
    await fs.promises.rename(tempFile, DATA_FILE_PATH);
  };

  writeLock = writeLock.then(op, op);
  return writeLock;
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
  if (input.number) {
    const parsed = parseInt(input.number, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const desiredNumber = String(parsed).padStart(2, "0");
      // If conflicting with existing service, conflicting takes nextNumber
      const conflictIndex = all.findIndex((s) => s.number === desiredNumber);
      if (conflictIndex !== -1) {
        all[conflictIndex].number = nextNumber;
        all[conflictIndex].updatedAt = now;
      }
      finalNumber = desiredNumber;
    }
  }

  const newService: ManagedService = {
    id,
    number: finalNumber,
    title: trimmedTitle,
    description: trimmedDesc,
    image: input.image || "/images/service_images/metal_roofing.jpg",
    createdAt: now,
    updatedAt: now,
  };

  all.push(newService);

  // Keep all services sorted by sequence number ascending
  all.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));

  await writeAllServices(all);

  try {
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
  } catch {}

  return newService;
}

export async function updateService(input: UpdateServiceInput): Promise<ManagedService> {
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
  if (input.number !== undefined) {
    const parsedNum = parseInt(input.number, 10);
    if (!isNaN(parsedNum) && parsedNum > 0) {
      const targetNumberStr = String(parsedNum).padStart(2, "0");
      const oldNumberStr = current.number;

      if (targetNumberStr !== oldNumberStr) {
        // Find existing service with targetNumberStr and SWAP numbers
        const conflictingIndex = all.findIndex((s) => s.id !== current.id && s.number === targetNumberStr);
        if (conflictingIndex !== -1) {
          all[conflictingIndex].number = oldNumberStr;
          all[conflictingIndex].updatedAt = now;
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

  all[index] = updatedService;

  // Keep all services sorted by sequence number ascending
  all.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));

  await writeAllServices(all);

  try {
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
  } catch {}

  return updatedService;
}

export async function deleteService(id: string): Promise<boolean> {
  const all = await readAllServices();
  const filtered = all.filter((s) => s.id !== id);

  if (filtered.length === all.length) {
    return false;
  }

  // Renumber remaining services consecutively 01, 02...
  const renumbered = filtered.map((s, idx) => ({
    ...s,
    number: String(idx + 1).padStart(2, "0"),
  }));

  await writeAllServices(renumbered);

  try {
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
  } catch {}

  return true;
}
