import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/storage/supabase";

export const dynamic = "force-dynamic";

/**
 * Scheduled keep-alive ping (configured in vercel.json every 4 days)
 * to prevent Supabase Free tier from auto-pausing due to 7-day inactivity.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "local",
      message: "Supabase env vars not set; keep-alive skipped.",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const { error } = await supabase
      .from("app_meta")
      .select("key")
      .limit(1);

    if (error) {
      console.error("Supabase keep-alive query failed:", error);
      return NextResponse.json(
        { ok: false, error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      database: "supabase",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Keep-alive error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
