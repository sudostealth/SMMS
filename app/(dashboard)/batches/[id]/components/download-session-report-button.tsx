"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText, File as FileIcon } from "lucide-react";
import { useState } from "react";
import { generateSessionReportPdf, generateSessionReportDocx } from "@/lib/utils/generate-session-report";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div>
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal text-xs text-muted-foreground pb-2">
                  <span className="font-medium text-foreground">Tip:</span> We recommend downloading DOCX. It is fully editable and has no layout issues compared to PDF.
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDownload('docx')} className="cursor-pointer font-medium text-primary">
                  <FileText className="mr-2 h-4 w-4" />
                  Download DOCX (Recommended)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('pdf')} className="cursor-pointer">
                  <FileIcon className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px] text-center">
          <p>We recommend DOCX format for editability and better layout.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
