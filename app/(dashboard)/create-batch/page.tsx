"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBatchAction } from "../actions";
import { createBatchSchema, type CreateBatchInput } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CreateBatchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateBatchInput>({
    resolver: zodResolver(createBatchSchema),
  });

  const semester = watch("semester");

  const onSubmit = async (data: CreateBatchInput) => {
    setIsLoading(true);
    try {
      const result = await createBatchAction(data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Success!",
        description: "Batch created successfully",
      });
      router.push(`/batches/${result.data!.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create batch",
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
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Batch</h1>
        <p className="text-muted-foreground mt-2">
          Add a new batch to manage students and sessions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch_name">Batch Name</Label>
              <Input
                id="batch_name"
                placeholder="e.g. CSE 261"
                {...register("batch_name")}
                disabled={isLoading}
              />
              {errors.batch_name && (
                <p className="text-sm text-destructive">{errors.batch_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_name">Department</Label>
              <Input
                id="department_name"
                placeholder="e.g. CSE, EEE, BBA"
                {...register("department_name")}
                disabled={isLoading}
              />
              {errors.department_name && (
                <p className="text-sm text-destructive">{errors.department_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                placeholder="e.g. 261-D1"
                {...register("section")}
                disabled={isLoading}
              />
              {errors.section && (
                <p className="text-sm text-destructive">{errors.section.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Student ID Range (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    id="student_id_start"
                    {...register("student_id_start")}
                    placeholder="e.g. 231902001 or 231-01"
                    disabled={isLoading}
                  />
                  {errors.student_id_start && (
                    <p className="text-sm text-destructive">{errors.student_id_start.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Start ID</p>
                </div>
                <div className="space-y-2">
                  <Input
                    id="student_id_end"
                    {...register("student_id_end")}
                    placeholder="e.g. 231902050 or 231-50"
                    disabled={isLoading}
                  />
                  {errors.student_id_end && (
                    <p className="text-sm text-destructive">{errors.student_id_end.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">End ID</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={semester}
                onValueChange={(value) => setValue("semester", value as any)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-sm text-destructive">{errors.semester.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Batch
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
