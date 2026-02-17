"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createStudentSchema, type CreateStudentInput } from "@/lib/validations/schemas";
import { updateStudentAction } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditStudentClientProps {
  batchId: string;
  student: {
    id: string;
    name: string;
    student_id: string;
    phone?: string;
    email?: string;
  };
}

export default function EditStudentClient({ batchId, student }: EditStudentClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
  });

  useEffect(() => {
    setValue("name", student.name);
    setValue("student_id", student.student_id);
    setValue("phone", student.phone || "");
    setValue("email", student.email || "");
  }, [student, setValue]);

  const onSubmit = async (data: CreateStudentInput) => {
    setIsLoading(true);
    try {
      const result = await updateStudentAction(batchId, student.id, data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Success!",
        description: "Student updated successfully",
      });
      router.push(`/batches/${batchId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update student",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/batches/${batchId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batch
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Student</h1>
        <p className="text-muted-foreground mt-2">Update student information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Edit the student details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter student name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID *</Label>
              <Input
                id="student_id"
                {...register("student_id")}
                placeholder="9-digit student ID"
                maxLength={9}
              />
              {errors.student_id && (
                <p className="text-sm text-destructive">{errors.student_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="student@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href={`/batches/${batchId}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
