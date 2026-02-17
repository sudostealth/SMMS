import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch mentor profile using auth_user_id
  const { data: mentor, error } = await supabase
    .from("mentors")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !mentor) {
    // If mentor record is missing, they might need to complete their profile
    // But for now, we'll redirect to login or show an error state.
    // Given the task, let's assume valid users should have a profile.
    console.error("Mentor profile not found for user:", user.id, error);
    // Maybe redirect to a 'create-profile' page if that existed?
    // For now, redirect to login as per existing behavior, but log the error.
    redirect("/login");
  }

  return <ProfileClient mentor={mentor} />;
}
