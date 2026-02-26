import { getStudentsByBatch } from "@/lib/services/student-service";
import { getSessionById } from "@/lib/services/session-service";
import { getAttendanceBySession } from "@/lib/services/attendance-service";
import { notFound } from "next/navigation";
import AttendanceMarkingClient from "./attendance-client";

interface AttendancePageProps {
  params: Promise<{
    id: string;
    sessionId: string;
  }>;
}

export default async function AttendancePage({ params }: AttendancePageProps) {
  const { id, sessionId } = await params;
  
  const [students, session, existingAttendance] = await Promise.all([
    getStudentsByBatch(id),
    getSessionById(sessionId),
    getAttendanceBySession(sessionId),
  ]);

  if (!session) {
    notFound();
  }

  return (
    <AttendanceMarkingClient
      params={{ id, sessionId }}
      students={students}
      sessionNumber={session.session_number}
      existingAttendance={existingAttendance}
    />
  );
}
