"use server";

import { getCurrentUser, getMentorProfile } from "@/lib/services/auth-service";
import { createBatch as createBatchDb, deleteBatch as deleteBatchDb, updateBatch as updateBatchDb } from "@/lib/services/batch-service";
import { createStudent, deleteStudent } from "@/lib/services/student-service";
import { createSession } from "@/lib/services/session-service";
import { bulkMarkAttendance } from "@/lib/services/attendance-service";
import type { CreateBatchInput, UpdateBatchInput, CreateStudentInput, CreateSessionInput, MarkAttendanceInput } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";

export async function createBatchAction(data: CreateBatchInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const mentor = await getMentorProfile(user.id);
    const batch = await createBatchDb(mentor.id, data);
    
    revalidatePath("/batches");
    revalidatePath("/dashboard");
    
    return { success: true, data: batch };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create batch" 
    };
  }
}

export async function updateBatchAction(batchId: string, data: UpdateBatchInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const batch = await updateBatchDb(batchId, data);
    
    revalidatePath(`/batches/${batchId}`);
    revalidatePath("/batches");
    revalidatePath("/dashboard");
    
    return { success: true, data: batch };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update batch" 
    };
  }
}

export async function deleteBatchAction(batchId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    await deleteBatchDb(batchId);

    revalidatePath("/batches");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete batch",
    };
  }
}

// Student Actions
export async function createStudentAction(batchId: string, data: CreateStudentInput) {
  "use server";
  try {
    const student = await createStudent(batchId, data);
    revalidatePath(`/batches/${batchId}`);
    return { success: true, data: student };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create student",
    };
  }
}

export async function deleteStudentAction(batchId: string, studentId: string) {
  "use server";
  try {
    await deleteStudent(studentId);
    revalidatePath(`/batches/${batchId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete student",
    };
  }
}

export async function bulkCreateStudentsAction(batchId: string, students: CreateStudentInput[]) {
  "use server";
  try {
    const results = await Promise.allSettled(
      students.map(student => createStudent(batchId, student))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    revalidatePath(`/batches/${batchId}`);
    
    return { 
      success: true, 
      data: { successful, failed, total: students.length }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to import students",
    };
  }
}

export async function updateStudentAction(batchId: string, studentId: string, data: CreateStudentInput) {
  "use server";
  try {
    // We'll need to add an updateStudent function in student-service
    const { updateStudent } = await import("@/lib/services/student-service");
    await updateStudent(studentId, data);
    revalidatePath(`/batches/${batchId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update student",
    };
  }
}

// Session Actions
export async function createSessionAction(batchId: string, data: CreateSessionInput) {
  "use server";
  try {
    const session = await createSession(batchId, data);
    revalidatePath(`/batches/${batchId}`);
    return { success: true, data: session };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create session",
    };
  }
}

export async function updateSessionAction(batchId: string, sessionId: string, data: CreateSessionInput) {
  "use server";
  try {
    const { updateSession } = await import("@/lib/services/session-service");
    await updateSession(sessionId, data);
    revalidatePath(`/batches/${batchId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update session",
    };
  }
}

// Attendance Actions
export async function markBulkAttendanceAction(
  batchId: string,
  sessionId: string,
  attendanceData: MarkAttendanceInput[]
) {
  "use server";
  try {
    const results = await bulkMarkAttendance(sessionId, attendanceData);
    revalidatePath(`/batches/${batchId}`);
    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark attendance",
    };
  }
}
