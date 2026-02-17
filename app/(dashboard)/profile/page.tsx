import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: mentor } = await supabase
    .from("mentors")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!mentor) {
    redirect("/login");
  }

  return <ProfileClient mentor={mentor} />;
}
