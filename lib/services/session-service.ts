import { createClient } from "@/lib/supabase/server";
import type { CreateSessionInput } from "@/lib/validations/schemas";
import type { Session } from "@/types";

export async function getSessionsByBatch(batchId: string): Promise<Session[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("batch_id", batchId)
    .order("session_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createSession(batchId: string, data: CreateSessionInput): Promise<Session> {
  const supabase = await createClient();

  const sessionData: any = {
    batch_id: batchId,
    session_number: data.session_number,
    session_date: data.session_date,
    method: data.method,
  };

  if (data.method === "Online") {
    sessionData.platform = data.platform;
    sessionData.room_number = null;
  } else {
    sessionData.room_number = data.room_number;
    sessionData.platform = null;
  }

  const { data: session, error } = await supabase
    .from("sessions")
    .insert(sessionData)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A session with this number already exists for this batch");
    }
    throw new Error(error.message);
  }

  return session;
}

export async function updateSession(sessionId: string, data: Partial<CreateSessionInput>): Promise<Session> {
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .update(data)
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }
}
