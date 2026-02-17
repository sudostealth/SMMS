"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AttendanceRecord {
  id: string;
  status: string;
  students?: {
    name: string;
    student_id: string;
  };
}

interface Session {
  id: string;
  session_number: number;
  session_date: string;
  method: string;
}

interface CollapsibleAttendanceProps {
  sessions: Session[];
  attendanceBySession: Map<string, AttendanceRecord[]>;
  totalStudents: number;
}

export default function CollapsibleAttendance({ sessions, attendanceBySession, totalStudents }: CollapsibleAttendanceProps) {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const expandAll = () => {
    setExpandedSessions(new Set(sessions.map(s => s.id)));
  };

  const collapseAll = () => {
    setExpandedSessions(new Set());
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No sessions created yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Expand/Collapse All Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={expandAll}>
          Expand All
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>
          Collapse All
        </Button>
      </div>

      {/* Session Cards */}
      {sessions.map((session) => {
        const attendanceRecords = attendanceBySession.get(session.id) || [];
        const presentCount = attendanceRecords.filter((a: any) => a.status === "Present").length;
        const percentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
        const isExpanded = expandedSessions.has(session.id);

        return (
          <Card key={session.id} className="border-l-4 border-l-primary">
            <CardHeader 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => toggleSession(session.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">Session {session.session_number}</CardTitle>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <CardDescription>
                    {new Date(session.session_date).toLocaleDateString()} • {session.method}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">
                    {presentCount}/{totalStudents} Present
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {isExpanded && attendanceRecords.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2 mt-4">
                  {attendanceRecords.map((record: any) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{record.students?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {record.students?.student_id}
                        </p>
                      </div>
                      <Badge variant={record.status === "Present" ? "default" : "destructive"}>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
