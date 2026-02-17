"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { markBulkAttendanceAction } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Check, X, UserCheck, UserX, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  name: string;
  student_id: string;
}

interface AttendanceMarkingPageProps {
  params: {
    id: string;
    sessionId: string;
  };
  students: Student[];
  sessionNumber: number;
}

export default function AttendanceMarkingClient({
  params,
  students,
  sessionNumber,
}: AttendanceMarkingPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, "Present" | "Absent">>({});

  // Sort students by student_id
  const sortedStudents = [...students].sort((a, b) => 
    a.student_id.localeCompare(b.student_id)
  );

  // Initialize all students as Present by default
  useEffect(() => {
    const initialAttendance: Record<string, "Present" | "Absent"> = {};
    students.forEach((student) => {
      initialAttendance[student.id] = "Present";
    });
    setAttendance(initialAttendance);
  }, [students]);

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const markAllPresent = () => {
    const allPresent: Record<string, "Present" | "Absent"> = {};
    students.forEach((student) => {
      allPresent[student.id] = "Present";
    });
    setAttendance(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent: Record<string, "Present" | "Absent"> = {};
    students.forEach((student) => {
      allAbsent[student.id] = "Absent";
    });
    setAttendance(allAbsent);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        status,
      }));

      const result = await markBulkAttendanceAction(params.id, params.sessionId, attendanceData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success!",
        description: "Attendance marked successfully",
      });
      router.push(`/batches/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const presentCount = Object.values(attendance).filter((status) => status === "Present").length;
  const absentCount = students.length - presentCount;
  const attendancePercentage = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/batches/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batch
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mark Attendance</h1>
            <p className="text-muted-foreground mt-2">Session {sessionNumber}</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {attendancePercentage}% Present
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-2 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled in this batch</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <UserCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Attending today</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <UserX className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Not attending</p>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>Click on student cards to toggle attendance status</CardDescription>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="default" 
                size="default" 
                onClick={markAllPresent} 
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Mark All Present
              </Button>
              <Button 
                variant="destructive" 
                size="default" 
                onClick={markAllAbsent}
                className="flex-1"
              >
                <UserX className="mr-2 h-4 w-4" />
                Mark All Absent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No students in this batch</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedStudents.map((student) => {
                const isPresent = attendance[student.id] === "Present";
                return (
                  <button
                    key={student.id}
                    onClick={() => toggleAttendance(student.id)}
                    className={`
                      w-full relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                      hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                      ${
                        isPresent
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : "border-red-500 bg-red-50 dark:bg-red-950/30"
                      }
                    `}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      {isPresent ? (
                        <div className="bg-green-500 rounded-full p-2">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div className="bg-red-500 rounded-full p-2">
                          <X className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Student Info */}
                    <div className="pr-16">
                      <p className={`font-semibold text-lg mb-2 ${isPresent ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"}`}>
                        {student.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                          ID: {student.student_id}
                        </Badge>
                        <Badge 
                          variant={isPresent ? "default" : "destructive"}
                          className="text-sm font-semibold"
                        >
                          {isPresent ? "Present" : "Absent"}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Click to continue or cancel
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/batches/${params.id}`}>Cancel</Link>
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || students.length === 0}
                className="min-w-[140px]"
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && <Check className="mr-2 h-4 w-4" />}
                Submit Attendance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
