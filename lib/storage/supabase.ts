import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "weltriq-media";

const writeLocks = new Map<string, Promise<void>>();
let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = "";

/**
 * Returns a server-side Supabase admin client using SUPABASE_SERVICE_ROLE_KEY,
 * or null in local development when Supabase env vars are not configured.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceKey) {
    return null;
  }

  const key = `${url}::${serviceKey.slice(0, 12)}`;
  if (!cachedClient || cachedConfigKey !== key) {
    cachedClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    cachedConfigKey = key;
  }

  return cachedClient;
}

export function isServerlessReadOnlyEnv(): boolean {
  return process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export function assertWritableStorageAvailable(supabase: SupabaseClient | null): void {
  if (!supabase && isServerlessReadOnlyEnv()) {
    throw new Error(
      "Supabase is not connected yet. Add SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables."
    );
  }
}

/**
 * Check & mark a one-time seed flag in public.app_meta so deleted items (e.g. test blogs)
 * are never re-seeded on future reads.
 */
export async function isSeedCompleted(
  supabase: SupabaseClient,
  seedKey: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("app_meta")
    .select("key")
    .eq("key", seedKey)
    .maybeSingle();

  if (error) {
    console.warn(`Unable to check app_meta seed flag "${seedKey}":`, error.message);
    return false;
  }

  return Boolean(data);
}

export async function markSeedCompleted(
  supabase: SupabaseClient,
  seedKey: string
): Promise<void> {
  const { error } = await supabase.from("app_meta").upsert(
    {
      key: seedKey,
      value: { seeded: true },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    console.warn(`Unable to persist app_meta seed flag "${seedKey}":`, error.message);
  }
}

/**
 * Local JSON fallback helpers (used seamlessly when running npm run dev locally without Supabase)
 */
export async function readLocalJsonFile<T>(
  localFilePath: string,
  fallbackValue: T
): Promise<T> {
  try {
    if (!fs.existsSync(localFilePath)) {
      return fallbackValue;
    }
    const raw = await fs.promises.readFile(localFilePath, "utf8");
    if (!raw.trim()) return fallbackValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading local JSON file "${localFilePath}":`, error);
    return fallbackValue;
  }
}

export async function writeLocalJsonFile<T>(
  localFilePath: string,
  data: T
): Promise<void> {
  if (isServerlessReadOnlyEnv()) {
    throw new Error(
      "Supabase is not connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables."
    );
  }

  const prev = writeLocks.get(localFilePath) ?? Promise.resolve();
  const op = async () => {
    const dir = path.dirname(localFilePath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    const tempFile = `${localFilePath}.${Date.now()}.${crypto.randomBytes(4).toString("hex")}.tmp`;
    await fs.promises.writeFile(tempFile, JSON.stringify(data, null, 2), "utf8");
    await fs.promises.rename(tempFile, localFilePath);
  };

  const next = prev.then(op, op);
  writeLocks.set(localFilePath, next);
  return next;
}

/**
 * Extract the object path inside weltriq-media if a URL belongs to Supabase Storage.
 */
export function extractSupabaseStoragePath(publicUrl: string | undefined): string | null {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.slice(idx + marker.length).split("?")[0]);
}
