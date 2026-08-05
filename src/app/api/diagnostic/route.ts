import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCarsAction } from "@/app/actions/cars";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostic: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      has_database_url: !!process.env.DATABASE_URL,
      node_env: process.env.NODE_ENV,
    },
    connection: null,
    table_check: null,
    cars_count: 0,
    cars_action_result: null,
  };

  // 1. Connection Test
  try {
    const start = Date.now();
    const testRes = await query("SELECT NOW()");
    diagnostic.connection = {
      success: true,
      latency_ms: Date.now() - start,
      time: testRes.rows[0],
    };
  } catch {
    diagnostic.connection = {
      success: false,
      error: "Database connection failed.",
    };
  }

  // 2. Table and count check
  if (typeof diagnostic.connection === "object" && diagnostic.connection !== null && "success" in diagnostic.connection && diagnostic.connection.success) {
    try {
      const tableCheck = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'cars'
        )
      `);
      const exists = tableCheck.rows[0]?.exists;
      diagnostic.table_check = { exists };

      if (exists) {
        const countRes = await query("SELECT count(*) FROM public.cars");
        diagnostic.cars_count = parseInt(countRes.rows[0]?.count || "0");
      }
    } catch {
      diagnostic.table_check = {
        error: "Table check failed.",
      };
    }
  }

  // 3. getCarsAction Test
  try {
    const actionRes = await getCarsAction();
    diagnostic.cars_action_result = actionRes;
  } catch {
    diagnostic.cars_action_result = {
      error: "Cars action failed.",
    };
  }

  return NextResponse.json(diagnostic);
}
