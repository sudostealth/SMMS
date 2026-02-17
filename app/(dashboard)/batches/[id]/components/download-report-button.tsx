"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { generateBatchReport } from "@/lib/utils/generate-pdf";
import { useLanguage } from "@/components/providers/language-provider";

interface DownloadReportButtonProps {
  batch: any; // Type should be more specific but keeping it simple for now
  students: any[];
  sessions: any[];
  attendanceData: Record<string, any[]>;
}

export function DownloadReportButton({
  batch,
  students,
  sessions,
  attendanceData,
}: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Simulate slight delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 500));
      generateBatchReport(batch, students, sessions, attendanceData);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {t("downloadReport") || "Download Report"}
    </Button>
  );
}
