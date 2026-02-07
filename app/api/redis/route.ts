import { NextResponse } from "next/server";
import { createClient, type RedisClientType } from "redis";

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: RedisClientType | undefined;
}

const redisUrl = process.env.REDIS_URL;

function isRedisConfigured() {
  return Boolean(redisUrl && redisUrl !== "database_provisioning_in_progress");
}

async function getRedisClient() {
  if (!isRedisConfigured()) {
    throw new Error("REDIS_URL is not configured.");
  }

  if (!globalThis.__redisClient) {
    globalThis.__redisClient = createClient({ url: redisUrl });
    globalThis.__redisClient.on("error", (error) => {
      console.error("Redis client error:", error);
    });
  }

  if (!globalThis.__redisClient.isOpen) {
    await globalThis.__redisClient.connect();
  }

  return globalThis.__redisClient;
}

export async function GET() {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "REDIS_URL is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const redis = await getRedisClient();
    const result = await redis.get("item");
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Error reading Redis key:", error);
    return NextResponse.json(
      { error: "Failed to connect to Redis or fetch data." },
      { status: 500 }
    );
  }
}
