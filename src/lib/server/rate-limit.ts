/**
 * In-memory throttle for the YouTube endpoints.
 *
 * Every preview and import spends YouTube Data API quota shared by all users,
 * so a click-happy client can exhaust the daily allowance. Keying by user id
 * stops one account draining it while leaving users behind the same NAT alone.
 *
 * This is per server instance; that is enough for the abuse case it guards
 * against, and a durable store can replace it without touching callers.
 */
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 30;

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export const isYoutubeRequestAllowed = (userId: string): boolean => {
  const now = Date.now();
  const bucket = buckets.get(userId);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(userId, { count: 1, resetAt: now + WINDOW_MS });

    return true;
  }

  if (bucket.count >= LIMIT) {
    return false;
  }

  bucket.count += 1;

  return true;
};
