"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp, checkAvailability } from "@/lib/services/auth-client";
import { signUpSchema, type SignUpInput } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    try {
      // Check availability first
      try {
        const availability = await checkAvailability(data.email, data.student_id);

        let hasError = false;
        if (availability.email_exists) {
          setError('email', { type: 'manual', message: 'Email already exists' });
          hasError = true;
        }
        if (availability.student_id_exists) {
           setError('student_id', { type: 'manual', message: 'Student ID already exists' });
           hasError = true;
        }

        if (hasError) {
          setIsLoading(false);
          return;
        }
      } catch (checkError) {
        console.error("Availability check failed", checkError);
        // We continue to try signUp if check fails, in case it's a transient network error
        // and the backend handles uniqueness anyway.
      }

      await signUp(data);
      setIsSuccess(true);
      toast({
        title: t("success"),
        description: t("emailVerificationDesc") || "Please check your email to verify your account.",
      });
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/50 shadow-xl relative z-10 transition-all duration-300">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
             <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t("signupTitle")}</CardTitle>
          <CardDescription className="text-center">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
           {isSuccess ? (
             <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md animate-in fade-in duration-500">
               <div className="flex flex-col items-center justify-center mb-4">
                 <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                   <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                   <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                 </svg>
               </div>
               <p className="text-sm text-green-800 dark:text-green-200 font-medium text-center">
                 {t("success")}
               </p>
               <p className="text-xs text-green-700 dark:text-green-300 mt-2 text-center">
                  Please check your email (<strong>{watch("email")}</strong>) and verify your account.
               </p>
               <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
                 Redirecting to login...
               </p>
             </div>
           ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t("fullName")}</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                {...register("full_name")}
                disabled={isLoading}
                className="bg-white/50 dark:bg-gray-800/50"
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="student_id">{t("studentId")}</Label>
              <Input
                id="student_id"
                type="text"
                placeholder="231XXXXXX"
                {...register("student_id")}
                disabled={isLoading}
                maxLength={9}
                 className="bg-white/50 dark:bg-gray-800/50"
              />
              {errors.student_id && (
                <p className="text-sm text-destructive">{errors.student_id.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch">{t("batch")}</Label>
                <Input
                  id="batch"
                  type="text"
                  placeholder="231"
                  {...register("batch")}
                  disabled={isLoading}
                  maxLength={3}
                   className="bg-white/50 dark:bg-gray-800/50"
                />
                {errors.batch && (
                  <p className="text-sm text-destructive">{errors.batch.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">{t("department")}</Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="CSE"
                  {...register("department")}
                  disabled={isLoading}
                  maxLength={10}
                   className="bg-white/50 dark:bg-gray-800/50"
                />
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="231XXXXXX@student.green.ac.bd"
                {...register("email")}
                disabled={isLoading}
                 className="bg-white/50 dark:bg-gray-800/50"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
                 className="bg-white/50 dark:bg-gray-800/50"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("signupTitle")}
              </Button>
          </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors">
              {t("signIn")}
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 group">
               <span className="group-hover:-translate-x-1 transition-transform">←</span> {t("backToHome")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
