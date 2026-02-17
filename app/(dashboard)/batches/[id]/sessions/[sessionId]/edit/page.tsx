import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditSessionClient from "./edit-client";

interface EditSessionPageProps {
  params: Promise<{
    id: string;
    sessionId: string;
  }>;
}

export default async function EditSessionPage({ params }: EditSessionPageProps) {
  const { id, sessionId } = await params;
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    notFound();
  }

  return <EditSessionClient batchId={id} session={session} />;
}
