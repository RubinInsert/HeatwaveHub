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
  // 10 request per hour
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});
