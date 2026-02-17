import { getBatchById } from "@/lib/services/batch-service";
import { getStudentsByBatch } from "@/lib/services/student-service";
import { getSessionsByBatch } from "@/lib/services/session-service";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentSearch from "./components/student-search";
import CollapsibleAttendance from "./components/collapsible-attendance";
import BatchEdit from "./components/batch-edit";
import Link from "next/link";
import { ArrowLeft, Users, CalendarDays, Upload, Plus } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const batch = await getBatchById(id);

  if (!batch) {
    notFound();
  }

  const students = await getStudentsByBatch(id);
  const sessions = await getSessionsByBatch(id);

  // Fetch attendance data for all sessions
  const supabase = await createClient();
  const attendanceBySession = new Map();
  
  for (const session of sessions) {
    const { data: attendanceRecords } = await supabase
      .from("attendance")
      .select(`
        *,
        students:student_id (
          name,
          student_id
        )
      `)
      .eq("session_id", session.id)
      .order("created_at");
    
    attendanceBySession.set(session.id, attendanceRecords || []);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/batches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batches
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{batch.batch_name}</h1>
            <p className="text-muted-foreground mt-2">
              {batch.department_name} • {batch.section} • {batch.semester}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              batch.status === "Active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {batch.status}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student List</CardTitle>
                  <CardDescription>
                    Search and view student information with attendance statistics
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/batches/${id}/students/import`}>
                      <Upload className="mr-2 h-4 w-4" />
                      Import Students
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/batches/${id}/students/add`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Student
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StudentSearch 
                students={students} 
                sessions={sessions}
                attendanceBySession={attendanceBySession}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session List</CardTitle>
              <CardDescription>
                View and manage all sessions for this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button asChild>
                  <Link href={`/batches/${id}/sessions/create`}>Create Session</Link>
                </Button>
              </div>
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sessions created yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">Session {session.session_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.session_date).toLocaleDateString()} • {session.method}
                          {session.method === "Online" && session.platform && ` • ${session.platform}`}
                          {session.method === "Offline" && session.room_number && ` • Room ${session.room_number}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/batches/${id}/sessions/${session.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/batches/${id}/sessions/${session.id}/attendance`}>
                            Mark Attendance
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Session-wise attendance tracking - Click to expand details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CollapsibleAttendance
                sessions={sessions}
                attendanceBySession={attendanceBySession}
                totalStudents={students.length}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <BatchEdit batch={batch} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
