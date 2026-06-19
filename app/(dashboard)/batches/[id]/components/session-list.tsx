"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { bulkDeleteSessionsAction } from "@/app/(dashboard)/actions";
import { DownloadSessionReportButton } from "./download-session-report-button";
import { Trash2 } from "lucide-react";
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

interface SessionListProps {
  batchId: string;
  sessions: any[];
  batch: any;
  students: any[];
  attendanceData: Record<string, any[]>;
  mentorName: string;
}

export default function SessionList({
  batchId,
  sessions,
  batch,
  students,
  attendanceData,
  mentorName,
}: SessionListProps) {
  const { toast } = useToast();
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSessions(new Set(sessions.map((s) => s.id)));
    } else {
      setSelectedSessions(new Set());
    }
  };

  const handleSelectSession = (sessionId: string, checked: boolean) => {
    const newSelected = new Set(selectedSessions);
    if (checked) {
      newSelected.add(sessionId);
    } else {
      newSelected.delete(sessionId);
    }
    setSelectedSessions(newSelected);
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const result = await bulkDeleteSessionsAction(batchId, Array.from(selectedSessions));
      if (!result.success) throw new Error(result.error);

      toast({
        title: "Success",
        description: `Successfully deleted ${selectedSessions.size} sessions`,
      });
      setSelectedSessions(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete sessions",
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
    }
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
      {/* Bulk Actions & Select All */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all-sessions"
            checked={selectedSessions.size === sessions.length && sessions.length > 0}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
          <label
            htmlFor="select-all-sessions"
            className="cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All
          </label>
        </div>

        {selectedSessions.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isBulkDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedSessions.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {selectedSessions.size}{" "}
                  selected sessions and remove all associated attendance records from our servers.
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

      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start gap-4 flex-1">
              <Checkbox
                className="mt-1"
                checked={selectedSessions.has(session.id)}
                onCheckedChange={(checked) => handleSelectSession(session.id, checked as boolean)}
              />
              <div>
                <p className="font-medium">Session {session.session_number}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(session.session_date).toLocaleDateString()} • {session.method}
                  {session.method === "Online" && session.platform && ` • ${session.platform}`}
                  {session.method === "Offline" && session.room_number && ` • Room ${session.room_number}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/batches/${batchId}/sessions/${session.id}/edit`} prefetch={true}>
                  Edit
                </Link>
              </Button>
              <DownloadSessionReportButton
                batch={batch}
                students={students}
                session={session}
                attendanceData={attendanceData[session.id] || []}
                mentorName={mentorName}
              />
              <Button variant="outline" size="sm" asChild>
                <Link href={`/batches/${batchId}/sessions/${session.id}/attendance`} prefetch={true}>
                  Mark Attendance
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
