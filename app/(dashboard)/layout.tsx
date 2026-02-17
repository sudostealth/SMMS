import { redirect } from "next/navigation";
import { getCurrentUser, getMentorProfile } from "@/lib/services/auth-service";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import Footer from "@/components/layout/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const mentor = await getMentorProfile(user.id);

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar mentor={mentor} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
