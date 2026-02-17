"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/services/auth-client";
import { signInSchema, type SignInInput } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function ErrorHandler() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "verify_email") {
      toast({
        title: t("emailVerificationRequired"),
        description: t("emailVerificationDesc"),
        variant: "destructive",
      });
    }
  }, [searchParams, toast, t]);

  return null;
}

function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      setIsSuccess(true);
      // Wait for animation
      setTimeout(() => {
        toast({
          title: t("loginSuccess"),
          description: t("loginSuccess"),
        });
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("failedToLogin"),
        variant: "destructive",
      });
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

      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>

      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/50 shadow-xl relative z-10 transition-all duration-300">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t("loginTitle")}</CardTitle>
          <CardDescription className="text-center">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-500">
               <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
              <p className="mt-4 text-lg font-medium text-green-600 dark:text-green-400 animate-pulse">
                {t("loginSuccess")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mentor@gub.edu.bd"
                  {...register("email")}
                  disabled={isLoading}
                  className="bg-white/50 dark:bg-gray-800/50"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  {/* Forgot password link could be added here */}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                   className="bg-white/50 dark:bg-gray-800/50"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("signIn")}
              </Button>
            </form>
          )}
        </CardContent>
        {!isSuccess && (
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {t("dontHaveAccount")}{" "}
              <Link href="/register" className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors">
                {t("registerHere")}
              </Link>
            </div>
            <div className="text-sm text-center">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> {t("backToHome")}
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
