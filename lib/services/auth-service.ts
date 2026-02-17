import { createClient as createServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
}

export async function getMentorProfile(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("mentors")
    .select("*")
    .eq("auth_user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
