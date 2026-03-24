import type { NextRequest } from "next/server";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitInput = {
  request: NextRequest;
  key: string;
  max: number;
  windowMs: number;
};

const globalRateLimitStore = globalThis as unknown as {
  __nutrielysRateLimitStore?: Map<string, RateLimitBucket>;
};

function getStore(): Map<string, RateLimitBucket> {
  if (!globalRateLimitStore.__nutrielysRateLimitStore) {
    globalRateLimitStore.__nutrielysRateLimitStore = new Map<string, RateLimitBucket>();
  }
  return globalRateLimitStore.__nutrielysRateLimitStore;
}

export function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "unknown-ip";
}

export function checkRateLimit({ request, key, max, windowMs }: RateLimitInput): {
  allowed: boolean;
  retryAfterSec: number;
} {
  const store = getStore();
  const ip = getClientIp(request);
  const now = Date.now();
  const id = `${key}:${ip}`;
  const existing = store.get(id);

  if (!existing || now > existing.resetAt) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.count >= max) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  store.set(id, existing);
  return { allowed: true, retryAfterSec: 0 };
}

export function isBotHoneypotTriggered(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const website = (body as { website?: unknown }).website;
  return typeof website === "string" && website.trim().length > 0;
}

export function isSuspiciousFormTiming(
  body: unknown,
  minFillMs = 1200,
  maxAgeMs = 2 * 60 * 60 * 1000
): boolean {
  if (!body || typeof body !== "object") return false;
  const startedAtRaw = (body as { form_started_at?: unknown }).form_started_at;
  if (typeof startedAtRaw !== "number" || !Number.isFinite(startedAtRaw)) return false;
  const elapsed = Date.now() - startedAtRaw;
  return elapsed < minFillMs || elapsed > maxAgeMs;
}
