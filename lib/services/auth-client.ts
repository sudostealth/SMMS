import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { SignUpInput, SignInInput } from "@/lib/validations/schemas";

export async function signUp(data: SignUpInput) {
  const supabase = createBrowserClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        student_id: data.student_id,
        batch: data.batch,
        department: data.department,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Check if error is due to unverified email
    if (error.message.includes("Email not confirmed")) {
      throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
    }
    throw error;
  }

  // Additional check for email verification
  if (data.user && !data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
  }

  return data;
}

export async function signOut() {
  const supabase = createBrowserClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
