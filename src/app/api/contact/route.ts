import { NextResponse, type NextRequest } from "next/server";

// Receives the contact form, filters out bots, and forwards real enquiries to the Google Apps
// Script web app, which emails them to the site owner. See docs/contact-form-setup.md.

export const dynamic = "force-dynamic";

const LIMITS = { name: 100, email: 200, message: 5000, context: 200 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 2500;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

// Best effort: each server instance keeps its own count, which is enough to slow a flood.
const recentSends = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const sends = (recentSends.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (sends.length >= RATE_LIMIT) return true;
  recentSends.set(ip, [...sends, now]);
  if (recentSends.size > 5000) recentSends.clear();
  return false;
}

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: NextRequest) {
  const url = process.env.CONTACT_APPS_SCRIPT_URL;
  const secret = process.env.CONTACT_APPS_SCRIPT_SECRET;
  if (!url || !secret) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Bots fill the hidden field or submit instantly; tell them it worked and drop the message.
  const startedAt = Number(body.startedAt);
  if (text(body.website, 200) || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const enquiry = {
    name: text(body.name, LIMITS.name),
    email: text(body.email, LIMITS.email),
    message: text(body.message, LIMITS.message),
    context: text(body.context, LIMITS.context),
  };
  if (!enquiry.name || !EMAIL_PATTERN.test(enquiry.email) || enquiry.message.length < 10) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const ip = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });

  try {
    // Apps Script answers a POST with a redirect to its result; fetch follows it.
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...enquiry, page: request.headers.get("referer") ?? "", secret }),
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    if (!response.ok || !result?.ok) throw new Error(`Apps Script replied ${response.status}`);
  } catch (error) {
    console.error("Contact form delivery failed", error);
    return NextResponse.json({ ok: false, error: "delivery-failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
