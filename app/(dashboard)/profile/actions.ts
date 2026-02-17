"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
      .eq("id", user.id);

    if (error) throw new Error(error.message);

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
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
