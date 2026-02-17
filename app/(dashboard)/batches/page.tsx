import { getCurrentUser, getMentorProfile } from "@/lib/services/auth-service";
import { getBatchesByMentor } from "@/lib/services/batch-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, PlusCircle } from "lucide-react";

export default async function BatchesPage() {
  const user = await getCurrentUser();
  const mentor = await getMentorProfile(user!.id);
  const batches = await getBatchesByMentor(mentor.id);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Batches</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your batches in one place
          </p>
        </div>
        <Button asChild>
          <Link href="/create-batch">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Batch
          </Link>
        </Button>
      </div>

      {/* Batches Grid */}
      {batches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No batches yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              You haven't created any batches yet. Get started by creating your first batch.
            </p>
            <Button asChild>
              <Link href="/create-batch">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Batch
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <Link key={batch.id} href={`/batches/${batch.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{batch.batch_name}</CardTitle>
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
                  <CardDescription>
                    {batch.department_name} • {batch.section}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Semester:</span>
                      <span className="font-medium">{batch.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {new Date(batch.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
