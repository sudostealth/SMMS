"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/services/auth-client";
import { signUpSchema, type SignUpInput } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    try {
      await signUp(data);
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Your account has been created. Please check your email to verify your account.",
      });
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Join GUSMP as a mentor and manage your batches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                {...register("full_name")}
                disabled={isLoading}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                type="text"
                placeholder="231XXXXX (e.g., 231902005)"
                {...register("student_id")}
                disabled={isLoading || isSuccess}
                maxLength={9}
              />
              {errors.student_id && (
                <p className="text-sm text-destructive">{errors.student_id.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                9 digits: First 3 = Batch, Next 3 = Department, Last 3 = Roll
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input
                  id="batch"
                  type="text"
                  placeholder="231"
                  {...register("batch")}
                  disabled={isLoading || isSuccess}
                  maxLength={3}
                />
                {errors.batch && (
                  <p className="text-sm text-destructive">{errors.batch.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="CSE"
                  {...register("department")}
                  disabled={isLoading || isSuccess}
                  maxLength={10}
                />
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="231902005@student.green.ac.bd"
                {...register("email")}
                disabled={isLoading || isSuccess}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Use your Green University student email (@student.green.ac.bd)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading || isSuccess}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
            {isSuccess ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  Registration successful!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Please check your email (<strong>{watch("email")}</strong>) and verify your account before logging in.
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  You will be redirected to login in a few seconds...
                </p>
              </div>
            ) : (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              ← Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
