"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateMentorProfileAction(data: {
  full_name: string;
  student_id?: string;
  batch?: string;
  department?: string;
}) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("mentors")
      .update({
        full_name: data.full_name,
        student_id: data.student_id,
        batch: data.batch,
        department: data.department,
      })
      .eq("auth_user_id", user.id);

    if (error) throw new Error(error.message);

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export async function deleteMentorAccountAction() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Delete mentor profile - allow RLS or cascade to handle associated data
    // Assuming cascade delete is set up on auth.users -> mentors
    // But we can't delete from auth.users directly via client library usually unless using service role
    // However, if we delete the mentor record, we might want to clean up.

    // Actually, to delete the user account entirely, we usually need admin privileges or call an edge function.
    // But let's see if we can just delete the mentor record and sign out.
    // If the schema has `ON DELETE CASCADE` for `auth_user_id`, deleting the user from `auth.users` would delete the mentor.
    // But we can't delete `auth.users` row easily from client without service role.

    // If we only delete the mentor record:
    const { error: mentorError } = await supabase
      .from("mentors")
      .delete()
      .eq("auth_user_id", user.id);

    if (mentorError) throw new Error(mentorError.message);

    // Sign out
    await supabase.auth.signOut();

    return { success: true };
  } catch (error) {
    console.error("Account deletion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete account",
    };
  }
}

export async function updateBatchAction(batchId: string, data: {
  batch_name: string;
  department_name: string;
  section: string;
  semester: string;
  academic_year: string;
  student_id_start?: string;
  student_id_end?: string;
  status: string;
}) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("batches")
      .update(data)
      .eq("id", batchId);

    if (error) throw new Error(error.message);

    revalidatePath(`/batches/${batchId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update batch",
    };
  }
}
