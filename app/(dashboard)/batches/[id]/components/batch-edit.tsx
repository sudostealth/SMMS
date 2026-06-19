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
import { deleteBatchAction } from "@/app/(dashboard)/actions";
import { Loader2, Trash2 } from "lucide-react";
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

interface Batch {
  id: string;
  batch_name: string;
  department_name: string;
  section: string;
  semester: string;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [formData, setFormData] = useState({
    batch_name: batch.batch_name,
    department_name: batch.department_name,
    section: batch.section,
    semester: batch.semester,
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

  const handleDelete = async () => {
    if (confirmName !== batch.batch_name) {
      toast({
        title: "Error",
        description: "Batch name does not match.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteBatchAction(batch.id);
      if (!result.success) {
        throw new Error(result.error);
      }
      toast({
        title: "Success",
        description: "Batch deleted successfully",
      });
      router.push("/batches");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete batch",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
                <SelectItem value="Graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center pt-4 border-t mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isLoading || isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Batch
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Batch</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the batch
                    <strong className="mx-1">{batch.batch_name}</strong>
                    along with all its students, sessions, and attendance records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Label htmlFor="confirm_name" className="text-sm font-medium">
                    Type <strong>{batch.batch_name}</strong> to confirm:
                  </Label>
                  <Input
                    id="confirm_name"
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    placeholder="Enter batch name"
                    className="mt-2"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setConfirmName("")}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      if (confirmName !== batch.batch_name) {
                        e.preventDefault();
                        toast({
                          title: "Error",
                          description: "Batch name does not match. Please type it exactly as shown.",
                          variant: "destructive",
                        });
                      } else {
                        handleDelete();
                      }
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting || confirmName !== batch.batch_name}
                  >
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={isLoading || isDeleting}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
