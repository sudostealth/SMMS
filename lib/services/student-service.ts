import { createClient } from "@/lib/supabase/server";
import type { CreateStudentInput } from "@/lib/validations/schemas";
import type { Student, StudentWithAttendance } from "@/types";

export async function getStudentsByBatch(batchId: string): Promise<Student[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("batch_id", batchId)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getStudentWithAttendance(studentId: string): Promise<StudentWithAttendance | null> {
  const supabase = await createClient();

  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (error) {
    return null;
  }

  // Get total sessions for this student's batch
  const { count: totalSessions } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("batch_id", student.batch_id);

  // Get attendance records for this student
  const { data: attendanceRecords } = await supabase
    .from("attendance")
    .select("status, sessions!inner(batch_id)")
    .eq("student_id", studentId)
    .eq("sessions.batch_id", student.batch_id);

  const sessionsAttended = attendanceRecords?.filter((a) => a.status === "Present").length || 0;
  const attendancePercentage = totalSessions
    ? Math.round((sessionsAttended / totalSessions) * 100)
    : 0;

  return {
    ...student,
    attendance_percentage: attendancePercentage,
    sessions_attended: sessionsAttended,
    total_sessions: totalSessions || 0,
  };
}

export async function createStudent(batchId: string, data: CreateStudentInput): Promise<Student> {
  const supabase = await createClient();

  const { data: student, error } = await supabase
    .from("students")
    .insert({
      batch_id: batchId,
      ...data,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A student with this ID already exists in this batch");
    }
    throw new Error(error.message);
  }

  return student;
}

export async function bulkCreateStudents(batchId: string, students: CreateStudentInput[]): Promise<Student[]> {
  const supabase = await createClient();

  const studentsWithBatch = students.map((student) => ({
    batch_id: batchId,
    ...student,
  }));

  const { data, error } = await supabase
    .from("students")
    .insert(studentsWithBatch)
    .select();

  if (error) {
    if (error.code === "23505") {
      throw new Error("One or more students with duplicate IDs detected");
    }
    throw new Error(error.message);
  }

  return data || [];
}

export async function updateStudent(studentId: string, data: Partial<CreateStudentInput>): Promise<Student> {
  const supabase = await createClient();

  const { data: student, error } = await supabase
    .from("students")
    .update(data)
    .eq("id", studentId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return student;
}

export async function deleteStudent(studentId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId);

  if (error) {
    throw new Error(error.message);
  }
}
