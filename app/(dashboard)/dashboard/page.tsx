import { getCurrentUser, getMentorProfile } from "@/lib/services/auth-service";
import { getBatchesByMentor } from "@/lib/services/batch-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const mentor = await getMentorProfile(user!.id);
  const batches = await getBatchesByMentor(mentor.id);

  const totalStudents = 0; // This would need a separate query
  const activeBatches = batches.filter((b) => b.status === "Active").length;
  const graduatedBatches = batches.filter((b) => b.status === "Graduated").length;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {mentor.full_name}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your mentorship activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground">
              All batches under your mentorship
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all your batches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBatches}</div>
            <p className="text-xs text-muted-foreground">
              Currently ongoing batches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduated</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graduatedBatches}</div>
            <p className="text-xs text-muted-foreground">
              Completed batches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Batches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Batches</CardTitle>
          <CardDescription>
            Your most recently created batches
          </CardDescription>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No batches yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first batch
              </p>
              <Button asChild>
                <Link href="/create-batch">Create Batch</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {batches.slice(0, 5).map((batch) => (
                <Link
                  key={batch.id}
                  href={`/batches/${batch.id}`}
                  className="block p-4 rounded-lg border hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{batch.batch_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {batch.department_name} • {batch.section} • {batch.semester}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          batch.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {batches.length > 5 && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/batches">View All Batches</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
