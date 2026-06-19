"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { deleteStudentAction, bulkDeleteStudentsAction } from "@/app/(dashboard)/actions";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Student {
  id: string;
  name: string;
  student_id: string;
  phone?: string;
  email?: string;
}

interface AttendanceStats {
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface StudentSearchProps {
  batchId: string;
  students: Student[];
  sessions: any[];
  attendanceBySession: Map<string, any[]>;
}

export default function StudentSearch({ batchId, students, sessions, attendanceBySession }: StudentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const result = await bulkDeleteStudentsAction(batchId, Array.from(selectedStudents));
      if (!result.success) throw new Error(result.error);

      toast({
        title: "Success",
        description: `Successfully deleted ${selectedStudents.size} students`,
      });
      setSelectedStudents(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete students",
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDelete = async (studentId: string) => {
    setIsDeleting(studentId);
    try {
      const result = await deleteStudentAction(batchId, studentId);
      if (!result.success) throw new Error(result.error);

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Calculate attendance statistics for each student
  const studentStats = useMemo(() => {
    const stats = new Map<string, AttendanceStats>();
    
    students.forEach(student => {
      let present = 0;
      let absent = 0;
      
      sessions.forEach(session => {
        const records = attendanceBySession.get(session.id) || [];
        const record = records.find((r: any) => r.student_id === student.id);
        if (record) {
          if (record.status === "Present") present++;
          else absent++;
        }
      });
      
      const total = present + absent;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      stats.set(student.id, { present, absent, total, percentage });
    });
    
    return stats;
  }, [students, sessions, attendanceBySession]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    
    const query = searchQuery.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.student_id.toLowerCase().includes(query) ||
      student.phone?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, student ID, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Bulk Actions */}
        {selectedStudents.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isBulkDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedStudents.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {selectedStudents.size} selected students and remove all their attendance records from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBulkDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Results Count & Select All */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {searchQuery ? (
            <span>Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</span>
          ) : (
            <span>Total {students.length} student{students.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        {filteredStudents.length > 0 && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
            <label htmlFor="select-all" className="cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select All
            </label>
          </div>
        )}
      </div>

      {/* Student List with Stats */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery ? "No students found matching your search" : "No students in this batch"}
            </p>
          </div>
        ) : (
          filteredStudents.map(student => {
            const stats = studentStats.get(student.id) || { present: 0, absent: 0, total: 0, percentage: 0 };
            
            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Checkbox
                        className="mt-1"
                        checked={selectedStudents.has(student.id)}
                        onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                      />
                      <div>
                        <CardTitle className="text-base">{student.name}</CardTitle>
                        <CardDescription className="mt-1">
                        ID: {student.student_id}
                          {student.phone && ` • ${student.phone}`}
                          {student.email && ` • ${student.email}`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={stats.percentage >= 75 ? "default" : stats.percentage >= 50 ? "secondary" : "destructive"}
                        className="ml-2"
                      >
                        {stats.percentage}%
                      </Badge>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link href={`/batches/${batchId}/students/${student.id}/edit`} prefetch={true}>
                          <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting === student.id}>
                            <Trash2 className="h-4 w-4 text-destructive hover:text-red-700" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete <b>{student.name}</b> and remove all their attendance records from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(student.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-lg text-green-600">{stats.present}</div>
                      <div className="text-muted-foreground">Present</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg text-red-600">{stats.absent}</div>
                      <div className="text-muted-foreground">Absent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">{stats.total}</div>
                      <div className="text-muted-foreground">Total Sessions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
