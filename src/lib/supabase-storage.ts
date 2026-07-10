import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let storageClient: SupabaseClient | null = null;

export function getSupabaseStorageClient() {
  if (!storageClient) {
    const url = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !publishableKey) {
      throw new Error("Supabase Storage is not configured.");
    }

    storageClient = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return storageClient;
}
