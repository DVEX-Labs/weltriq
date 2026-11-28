import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Redis } from "@upstash/redis";

const writeLocks = new Map<string, Promise<void>>();

/**
 * Initialize an Upstash / Vercel KV Redis client when REST env vars are present.
 * Returns null in local development so local JSON files continue working seamlessly.
 */
export function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

export function isServerlessReadOnlyEnv(): boolean {
  return process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}

/**
 * Read a JSON store from Upstash Redis / Vercel KV (if configured),
 * seeding once from the bundled local JSON file if the Redis key does not exist yet.
 */
export async function readJsonStore<T>(
  redisKey: string,
  localFilePath: string,
  fallbackValue: T
): Promise<T> {
  const redis = getRedisClient();

  if (redis) {
    const existing = await redis.get<T>(redisKey);
    if (existing !== null && existing !== undefined) {
      return existing;
    }

    const seed = await readLocalFileSafe<T>(localFilePath, fallbackValue);
    try {
      await redis.set(redisKey, seed);
    } catch (err) {
      console.error(`Failed to seed Redis key "${redisKey}":`, err);
    }
    return seed;
  }

  return readLocalFileSafe<T>(localFilePath, fallbackValue);
}

/**
 * Read an optional JSON store (returns null if neither Redis key nor local file exists).
 */
export async function readOptionalJsonStore<T>(
  redisKey: string,
  localFilePath: string
): Promise<T | null> {
  const redis = getRedisClient();

  if (redis) {
    const existing = await redis.get<T>(redisKey);
    if (existing !== null && existing !== undefined) {
      return existing;
    }

    const localSeed = await readLocalFileSafe<T | null>(localFilePath, null);
    if (localSeed !== null) {
      try {
        await redis.set(redisKey, localSeed);
      } catch (err) {
        console.error(`Failed to seed optional Redis key "${redisKey}":`, err);
      }
    }
    return localSeed;
  }

  return readLocalFileSafe<T | null>(localFilePath, null);
}

/**
 * Persist a JSON store to Upstash Redis / Vercel KV when configured,
 * or atomically to local disk in local development.
 */
export async function writeJsonStore<T>(
  redisKey: string,
  localFilePath: string,
  data: T
): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    await redis.set(redisKey, data);
    return;
  }

  if (isServerlessReadOnlyEnv()) {
    throw new Error(
      "Cloud storage is not connected. Add an Upstash Redis / Vercel KV database in Vercel Storage to save changes on the live site."
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

async function readLocalFileSafe<T>(localFilePath: string, fallbackValue: T): Promise<T> {
  try {
    if (!fs.existsSync(localFilePath)) {
      return fallbackValue;
    }
    const raw = await fs.promises.readFile(localFilePath, "utf8");
    if (!raw.trim()) return fallbackValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading local JSON store "${localFilePath}":`, error);
    return fallbackValue;
  }
}
