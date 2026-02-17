import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditStudentClient from "./edit-client";

interface EditStudentPageProps {
  params: Promise<{
    id: string;
    studentId: string;
  }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id, studentId } = await params;
  const supabase = await createClient();

  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (error || !student) {
    notFound();
  }

  return <EditStudentClient batchId={id} student={student} />;
}
