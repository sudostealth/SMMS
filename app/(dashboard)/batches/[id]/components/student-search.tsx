"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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
  students: Student[];
  sessions: any[];
  attendanceBySession: Map<string, any[]>;
}

export default function StudentSearch({ students, sessions, attendanceBySession }: StudentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, student ID, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
        </p>
      )}

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
                    <div className="flex-1">
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <CardDescription className="mt-1">
                        ID: {student.student_id}
                        {student.phone && ` • ${student.phone}`}
                        {student.email && ` • ${student.email}`}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={stats.percentage >= 75 ? "default" : stats.percentage >= 50 ? "secondary" : "destructive"}
                      className="ml-2"
                    >
                      {stats.percentage}%
                    </Badge>
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
