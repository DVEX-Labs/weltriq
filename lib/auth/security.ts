import path from "path";
import crypto from "crypto";
import { readOptionalJsonStore, writeJsonStore } from "@/lib/storage/kv";

const SECURITY_FILE_PATH = path.join(process.cwd(), "data", "admin-security.json");
const REDIS_KEY = "weltriq:security";
const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || "weltriq2026!";

export interface SecurityRecord {
  username: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

/**
 * Hash password using PBKDF2 with SHA-512
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

/**
 * Get the stored admin credentials from Redis / local JSON, or null if using default env values
 */
export async function getStoredSecurityRecord(): Promise<SecurityRecord | null> {
  return readOptionalJsonStore<SecurityRecord>(REDIS_KEY, SECURITY_FILE_PATH);
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

  // 4. Persist to Redis / local storage
  await writeJsonStore<SecurityRecord>(REDIS_KEY, SECURITY_FILE_PATH, updatedRecord);

  return { success: true };
}
