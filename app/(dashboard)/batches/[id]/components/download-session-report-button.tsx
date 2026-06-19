"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText, File as FileIcon } from "lucide-react";
import { useState } from "react";
import { generateSessionReportPdf, generateSessionReportDocx } from "@/lib/utils/generate-session-report";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DownloadSessionReportButtonProps {
  batch: any;
  students: any[];
  session: any;
  attendanceData: any[];
  mentorName: string;
}

export function DownloadSessionReportButton({
  batch,
  students,
  session,
  attendanceData,
  mentorName,
}: DownloadSessionReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async (type: 'pdf' | 'docx') => {
    setIsGenerating(true);
    try {
      if (type === 'pdf') {
        await generateSessionReportPdf(batch, students, session, attendanceData, mentorName);
      } else {
        await generateSessionReportDocx(batch, students, session, attendanceData, mentorName);
      }
    } catch (error) {
      console.error(`Failed to generate ${type.toUpperCase()}:`, error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownload('pdf')} className="cursor-pointer">
          <FileIcon className="mr-2 h-4 w-4" />
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('docx')} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          Download DOCX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
