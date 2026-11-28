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

const SECURITY_FILE_PATH = path.join(process.cwd(), "data", "admin-security.json");
const SEED_KEY = "security_seeded";
const ROW_ID = "admin";
const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || "weltriq2026!";

export interface SecurityRecord {
  username: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

interface SecurityRow {
  id: string;
  username: string;
  password_hash: string;
  salt: string;
  updated_at: string;
}

/**
 * Hash password using PBKDF2 with SHA-512
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

/**
 * Get the stored admin credentials from Supabase / local JSON, or null if using default env values
 */
export async function getStoredSecurityRecord(): Promise<SecurityRecord | null> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("admin_security")
      .select("*")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) {
      console.error("Supabase read admin_security error:", error.message);
      return null;
    }

    if (data) {
      const row = data as SecurityRow;
      return {
        username: row.username,
        passwordHash: row.password_hash,
        salt: row.salt,
        updatedAt: row.updated_at,
      };
    }

    const alreadySeeded = await isSeedCompleted(supabase, SEED_KEY);
    if (!alreadySeeded) {
      const localSeed = await readLocalJsonFile<SecurityRecord | null>(SECURITY_FILE_PATH, null);
      if (localSeed && localSeed.passwordHash && localSeed.salt) {
        await supabase.from("admin_security").upsert(
          {
            id: ROW_ID,
            username: localSeed.username,
            password_hash: localSeed.passwordHash,
            salt: localSeed.salt,
            updated_at: localSeed.updatedAt,
          },
          { onConflict: "id" }
        );
      }
      await markSeedCompleted(supabase, SEED_KEY);
      return localSeed;
    }

    return null;
  }

  return readLocalJsonFile<SecurityRecord | null>(SECURITY_FILE_PATH, null);
}

/**
 * Credential check used during login and password updates
 */
export async function checkAdminCredentials(username: string, password: string): Promise<boolean> {
  const trimmedUser = username.trim();
  const record = await getStoredSecurityRecord();

  if (record && record.passwordHash && record.salt) {
    if (trimmedUser !== record.username) return false;
    const computedHash = hashPassword(password, record.salt);
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, "hex"),
      Buffer.from(record.passwordHash, "hex")
    );
  }

  // Fallback to environment variables or defaults
  const expectedUser = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASS;

  return trimmedUser === expectedUser && password === expectedPass;
}

/**
 * Update the administrator password
 */
export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

  // 1. Verify current credentials
  const currentRecord = await getStoredSecurityRecord();
  const username = currentRecord?.username || process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USER;

  const isCurrentValid = await checkAdminCredentials(username, currentPassword);
  if (!isCurrentValid) {
    return { success: false, error: "Current password does not match. Please verify and try again." };
  }

  // 2. Validate new password strength
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
  }

  // 3. Generate salt & hash
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);

  const updatedRecord: SecurityRecord = {
    username,
    passwordHash,
    salt,
    updatedAt: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from("admin_security").upsert(
      {
        id: ROW_ID,
        username: updatedRecord.username,
        password_hash: updatedRecord.passwordHash,
        salt: updatedRecord.salt,
        updated_at: updatedRecord.updatedAt,
      },
      { onConflict: "id" }
    );

    if (error) {
      throw new Error(`Failed to update password in Supabase: ${error.message}`);
    }
    await markSeedCompleted(supabase, SEED_KEY);
  } else {
    await writeLocalJsonFile<SecurityRecord>(SECURITY_FILE_PATH, updatedRecord);
  }

  return { success: true };
}
