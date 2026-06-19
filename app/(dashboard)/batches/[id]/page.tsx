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
import SessionList from "./components/session-list";
import { DownloadReportButton } from "./components/download-report-button";
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
  const { data: userData } = await supabase.auth.getUser();
  const mentorName = userData.user?.user_metadata?.full_name || "Mentor";
  const attendanceBySession = new Map();
  const attendanceData: Record<string, any[]> = {}; // For PDF generation and serialization
  
  if (sessions.length > 0) {
    const sessionIds = sessions.map(s => s.id);

    // Single query to fetch all attendance records for the sessions in this batch
    const { data: allAttendanceRecords } = await supabase
      .from("attendance")
      .select(`
        *,
        students:student_id (
          name,
          student_id
        )
      `)
      .in("session_id", sessionIds)
      .order("created_at");

    if (allAttendanceRecords) {
      for (const session of sessions) {
        const sessionRecords = allAttendanceRecords.filter(r => r.session_id === session.id);
        attendanceBySession.set(session.id, sessionRecords);
        attendanceData[session.id] = sessionRecords;
      }
    } else {
      for (const session of sessions) {
        attendanceBySession.set(session.id, []);
        attendanceData[session.id] = [];
      }
    }
  }

  // Calculate overall attendance percentage
  let totalPresent = 0;
  let totalRecords = 0;

  for (const records of attendanceBySession.values()) {
    if (records) {
      totalRecords += records.length;
      totalPresent += records.filter((r: any) => r.status === "Present").length;
    }
  }

  const attendanceRate = totalRecords > 0
    ? Math.round((totalPresent / totalRecords) * 100)
    : 0;

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
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{batch.batch_name}</h1>
            <p className="text-muted-foreground mt-2">
              {batch.department_name} • {batch.section} • {batch.semester}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DownloadReportButton
              batch={batch}
              students={students}
              sessions={sessions}
              attendanceData={attendanceData}
            />
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
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
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
                batchId={id}
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
              <SessionList
                batchId={id}
                sessions={sessions}
                batch={batch}
                students={students}
                attendanceData={attendanceData}
                mentorName={mentorName}
              />
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
