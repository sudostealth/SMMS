import { createClient } from "@/lib/supabase/server";
import type { CreateBatchInput, UpdateBatchInput } from "@/lib/validations/schemas";
import type { Batch, BatchWithStats } from "@/types";

export async function getBatchesByMentor(mentorId: string): Promise<Batch[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .eq("mentor_id", mentorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getBatchById(batchId: string): Promise<Batch | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getBatchWithStats(batchId: string): Promise<BatchWithStats | null> {
  const supabase = await createClient();

  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (batchError) {
    return null;
  }

  // Get student count
  const { count: studentCount } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("batch_id", batchId);

  // Get session count
  const { count: sessionCount } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("batch_id", batchId);

  // Calculate attendance percentage
  const { data: attendanceData } = await supabase
    .from("attendance")
    .select("status, sessions!inner(batch_id)")
    .eq("sessions.batch_id", batchId);

  let attendancePercentage = 0;
  if (attendanceData && attendanceData.length > 0) {
    const presentCount = attendanceData.filter((a) => a.status === "Present").length;
    attendancePercentage = Math.round((presentCount / attendanceData.length) * 100);
  }

  return {
    ...batch,
    student_count: studentCount || 0,
    session_count: sessionCount || 0,
    attendance_percentage: attendancePercentage,
  };
}

export async function createBatch(mentorId: string, data: CreateBatchInput): Promise<Batch> {
  const supabase = await createClient();

  const { data: batch, error } = await supabase
    .from("batches")
    .insert({
      mentor_id: mentorId,
      ...data,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return batch;
}

export async function updateBatch(batchId: string, data: UpdateBatchInput): Promise<Batch> {
  const supabase = await createClient();

  const { data: batch, error } = await supabase
    .from("batches")
    .update(data)
    .eq("id", batchId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return batch;
}

export async function deleteBatch(batchId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("batches")
    .delete()
    .eq("id", batchId);

  if (error) {
    throw new Error(error.message);
  }
}
