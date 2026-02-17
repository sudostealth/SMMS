"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudentAction } from "@/app/(dashboard)/actions";
import { createStudentSchema, type CreateStudentInput } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AddStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AddStudentPage({ params }: AddStudentPageProps) {
  const { id } = await params;
  
  return <AddStudentClient batchId={id} />;
}

function AddStudentClient({ batchId }: { batchId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
  });

  const onSubmit = async (data: CreateStudentInput) => {
    setIsLoading(true);
    try {
      const result = await createStudentAction(batchId, data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Success!",
        description: "Student added successfully",
      });
      router.push(`/batches/${batchId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add student",
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
        <h1 className="text-3xl font-bold">Add Student</h1>
        <p className="text-muted-foreground mt-2">
          Add a new student to this batch
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>
            Fill in the details below to add a new student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                {...register("name")}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                placeholder="e.g. 231902005"
                {...register("student_id")}
                disabled={isLoading}
              />
              {errors.student_id && (
                <p className="text-sm text-destructive">{errors.student_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                placeholder="e.g. 01712345678"
                {...register("phone")}
                disabled={isLoading}
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
                placeholder="e.g. student@example.com"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Student
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
