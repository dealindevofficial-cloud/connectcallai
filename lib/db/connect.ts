import dns from "node:dns";
import mongoose from "mongoose";

/** Prefer IPv4 for DNS on Windows—often fixes `querySrv ECONNREFUSED` with Atlas `mongodb+srv`. */
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithCache = globalThis as typeof globalThis & {
  __mongooseCache?: MongooseCache;
};

const cache: MongooseCache =
  globalWithCache.__mongooseCache ?? { conn: null, promise: null };

if (!globalWithCache.__mongooseCache) {
  globalWithCache.__mongooseCache = cache;
}

/** True when `MONGODB_URI` is non-empty (blog and admin need this). */
export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

/**
 * Reuses the same Mongoose connection across Next.js serverless invocations.
 * Throws if `MONGODB_URI` is missing when called.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy `.env.example` to `.env.local` and set MONGODB_URI to your MongoDB connection string (Atlas or mongodb://127.0.0.1:27017/dbname)."
    );
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      /** Prefer IPv4 when resolving Atlas hosts (helps some corporate / home networks). */
      family: 4,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
