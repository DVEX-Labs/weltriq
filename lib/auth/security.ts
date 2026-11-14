import fs from "fs";
import path from "path";
import crypto from "crypto";

const SECURITY_FILE_PATH = path.join(process.cwd(), "data", "admin-security.json");
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
 * Get the stored admin credentials, or null if using default environment values
 */
export function getStoredSecurityRecord(): SecurityRecord | null {
  try {
    if (!fs.existsSync(SECURITY_FILE_PATH)) {
      return null;
    }
    const data = fs.readFileSync(SECURITY_FILE_PATH, "utf8");
    return JSON.parse(data || "{}") as SecurityRecord;
  } catch (error) {
    console.error("Error reading admin security record:", error);
    return null;
  }
}

/**
 * Synchronous credential check used during login
 */
export function checkAdminCredentials(username: string, password: string): boolean {
  const trimmedUser = username.trim();
  const record = getStoredSecurityRecord();

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
  const currentRecord = getStoredSecurityRecord();
  const username = currentRecord?.username || process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USER;

  const isCurrentValid = checkAdminCredentials(username, currentPassword);
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

  // 4. Save safely to file
  const dir = path.dirname(SECURITY_FILE_PATH);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }

  const tempFile = `${SECURITY_FILE_PATH}.${Date.now()}.tmp`;
  await fs.promises.writeFile(tempFile, JSON.stringify(updatedRecord, null, 2), "utf8");
  await fs.promises.rename(tempFile, SECURITY_FILE_PATH);

  return { success: true };
}

