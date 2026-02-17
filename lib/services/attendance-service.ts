import { createClient } from "@/lib/supabase/server";
import type { MarkAttendanceInput } from "@/lib/validations/schemas";
import type { Attendance } from "@/types";

export async function getAttendanceBySession(sessionId: string): Promise<Attendance[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function markAttendance(
  sessionId: string,
  studentId: string,
  status: "Present" | "Absent"
): Promise<Attendance> {
  const supabase = await createClient();

  // Check if attendance already exists
  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .single();

  if (existing) {
    // Update existing attendance
    const { data, error } = await supabase
      .from("attendance")
      .update({ status })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Create new attendance record
  const { data, error } = await supabase
    .from("attendance")
    .insert({
      session_id: sessionId,
      student_id: studentId,
      status,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function bulkMarkAttendance(
  sessionId: string,
  attendanceData: MarkAttendanceInput[]
): Promise<Attendance[]> {
  const supabase = await createClient();

  // First, get existing attendance for this session
  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", sessionId);

  const existingMap = new Map(existing?.map((a) => [a.student_id, a]) || []);

  const updates: any[] = [];

  for (const record of attendanceData) {
    const existingRecord = existingMap.get(record.student_id);

    if (existingRecord) {
      // Update existing
      const promise = Promise.resolve(
        supabase
          .from("attendance")
          .update({ status: record.status })
          .eq("id", existingRecord.id)
          .select()
          .single()
          .then(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data;
          })
      );
      updates.push(promise);
    } else {
      // Insert new
      const promise = Promise.resolve(
        supabase
          .from("attendance")
          .insert({
            session_id: sessionId,
            student_id: record.student_id,
            status: record.status,
          })
          .select()
          .single()
          .then(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data;
          })
      );
      updates.push(promise);
    }
  }

  const results = await Promise.all(updates);
  return results.filter((r): r is Attendance => r !== null);
}

export async function updateAttendance(attendanceId: string, status: "Present" | "Absent"): Promise<Attendance> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attendance")
    .update({ status })
    .eq("id", attendanceId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteAttendance(attendanceId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("id", attendanceId);

  if (error) {
    throw new Error(error.message);
  }
}
