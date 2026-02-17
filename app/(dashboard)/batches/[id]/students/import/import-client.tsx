"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { bulkCreateStudentsAction } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Upload, FileSpreadsheet, Download } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StudentRow {
  name: string;
  student_id: string;
  phone?: string;
  email?: string;
}

export default function ImportStudentClient({ batchId }: { batchId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const downloadTemplate = () => {
    const template = [
      { name: "John Doe", student_id: "231902001", phone: "01712345678", email: "john@example.com" },
      { name: "Jane Smith", student_id: "231902002", phone: "01712345679", email: "jane@example.com" },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_import_template.xlsx");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processData(results.data as StudentRow[]);
        },
        error: (error) => {
          toast({
            title: "Error",
            description: `Failed to parse CSV: ${error.message}`,
            variant: "destructive",
          });
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as StudentRow[];
          processData(jsonData);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to parse Excel file",
            variant: "destructive",
          });
        }
      };
      reader.readAsBinaryString(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
    }
  };

  const processData = (data: StudentRow[]) => {
    const validationErrors: string[] = [];
    const validStudents: StudentRow[] = [];

    data.forEach((row, index) => {
      if (!row.name || !row.student_id) {
        validationErrors.push(`Row ${index + 1}: Name and Student ID are required`);
      } else {
        validStudents.push({
          name: row.name.trim(),
          student_id: row.student_id.toString().trim(),
          phone: row.phone?.toString().trim() || "",
          email: row.email?.trim() || "",
        });
      }
    });

    setErrors(validationErrors);
    setStudents(validStudents);
  };

  const handleImport = async () => {
    if (students.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload a file with student data",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkCreateStudentsAction(batchId, students);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Import Complete!",
        description: `Successfully imported ${result.data?.successful || 0} students. ${(result.data?.failed || 0) > 0 ? `${result.data?.failed} failed.` : ""}`,
      });
      router.push(`/batches/${batchId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import students",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/batches/${batchId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batch
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Import Students</h1>
        <p className="text-muted-foreground mt-2">
          Upload a CSV or Excel file to add multiple students at once
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Select a CSV or Excel file containing student information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <div className="text-sm text-muted-foreground">
                Start with our template to ensure proper formatting
              </div>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload CSV or Excel file</p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: .csv, .xlsx, .xls
                  </p>
                </div>
              </label>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <div className="font-medium mb-2">Found {errors.length} error(s):</div>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.slice(0, 5).map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                    {errors.length > 5 && (
                      <li className="text-sm">...and {errors.length - 5} more</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {students.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview ({students.length} students)</CardTitle>
              <CardDescription>
                Review the data before importing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.student_id}</TableCell>
                        <TableCell>{student.phone || "-"}</TableCell>
                        <TableCell>{student.email || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStudents([])}>
                  Clear
                </Button>
                <Button onClick={handleImport} disabled={isLoading || errors.length > 0}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Upload className="mr-2 h-4 w-4" />
                  Import {students.length} Students
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
