import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create the Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create the ratelimiter instance
export const ratelimit = new Ratelimit({
  redis: redis,
  // 1 request per 24 hours (86400 seconds)
  limiter: Ratelimit.slidingWindow(1, "86400 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});
