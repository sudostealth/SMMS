"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateBatchAction } from "@/app/(dashboard)/profile/actions";
import { Loader2 } from "lucide-react";

interface Batch {
  id: string;
  batch_name: string;
  department_name: string;
  section: string;
  semester: string;
  academic_year: string;
  student_id_start?: string;
  student_id_end?: string;
  status: string;
}

interface BatchEditProps {
  batch: Batch;
}

export default function BatchEdit({ batch }: BatchEditProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    batch_name: batch.batch_name,
    department_name: batch.department_name,
    section: batch.section,
    semester: batch.semester,
    academic_year: batch.academic_year,
    student_id_start: batch.student_id_start || "",
    student_id_end: batch.student_id_end || "",
    status: batch.status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateBatchAction(batch.id, formData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Success!",
        description: "Batch updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update batch",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Settings</CardTitle>
        <CardDescription>Update batch information and configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch_name">Batch Name *</Label>
            <Input
              id="batch_name"
              value={formData.batch_name}
              onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
              placeholder="Enter batch name"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department_name">Department *</Label>
              <Input
                id="department_name"
                value={formData.department_name}
                onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section *</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g., A"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="e.g., Fall 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year">Academic Year *</Label>
              <Input
                id="academic_year"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                placeholder="e.g., 2024-2025"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_id_start">Student ID Start (Optional)</Label>
              <Input
                id="student_id_start"
                value={formData.student_id_start}
                onChange={(e) => setFormData({ ...formData, student_id_start: e.target.value })}
                placeholder="e.g., 221001001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_id_end">Student ID End (Optional)</Label>
              <Input
                id="student_id_end"
                value={formData.student_id_end}
                onChange={(e) => setFormData({ ...formData, student_id_end: e.target.value })}
                placeholder="e.g., 221001050"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
