import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "weltriq_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "weltriq-secure-blog-admin-secret-2026";
const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || "weltriq2026!";

// 7 days in seconds
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

/**
 * Sign payload using HMAC-SHA256
 */
function signPayload(payload: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  return `${payload}.${hmac.digest("hex")}`;
}

/**
 * Verify HMAC-SHA256 signature and return payload if valid
 */
function verifySignature(signedToken: string): string | null {
  const lastDot = signedToken.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = signedToken.substring(0, lastDot);
  const signature = signedToken.substring(lastDot + 1);

  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  const expectedSig = hmac.digest("hex");

  // Constant-time comparison to protect against timing attacks
  if (
    signature.length === expectedSig.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
  ) {
    return payload;
  }

  return null;
}

/**
 * Create a signed session token
 */
export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = JSON.stringify({ u: username, exp: expiresAt });
  return signPayload(Buffer.from(payload).toString("base64url"));
}

/**
 * Verify a signed session token
 */
export function verifySessionToken(token: string | undefined): { valid: boolean; username?: string } {
  if (!token) return { valid: false };

  try {
    const rawPayload = verifySignature(token);
    if (!rawPayload) return { valid: false };

    const decoded = Buffer.from(rawPayload, "base64url").toString("utf8");
    const data = JSON.parse(decoded) as { u: string; exp: number };

    if (!data.exp || data.exp < Date.now()) {
      return { valid: false };
    }

    return { valid: true, username: data.u };
  } catch (error) {
    return { valid: false };
  }
}

/**
 * Validate submitted credentials
 */
export function validateAdminCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASS;

  return username.trim() === expectedUser && password === expectedPass;
}

/**
 * Check if the current request has an active, valid admin session
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token).valid;
}

/**
 * Set the admin session cookie in a Server Action or Route Handler
 */
export async function setAdminSessionCookie(username: string): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken(username);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Clear the admin session cookie (logout)
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
