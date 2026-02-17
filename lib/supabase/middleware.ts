import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = await createClient();

  // Refresh session if expired
  await supabase.auth.getUser();

  return supabaseResponse;
}
