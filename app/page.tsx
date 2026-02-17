"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import Footer from "@/components/layout/footer";
import { GraduationCap, Users, CalendarCheck, BarChart3, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">GUSMP</h1>
              <p className="text-xs text-muted-foreground">{t("mentorManagement")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center relative z-10">
        <div className="text-center space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-sm font-medium text-primary">
              {t("greenUniversity")}
            </p>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
            {t("welcome")}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-500 to-emerald-600 mt-2 pb-2">
              {t("subtitle")}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group">
              <Link href="/login">
                {t("login")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-primary/5 hover:scale-105 transition-all duration-300">
              <Link href="/register">{t("signup")}</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 pt-20 text-left">
            <div className="group bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t("batchManagement")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("batchManagementDesc")}
              </p>
            </div>
            
            <div className="group bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CalendarCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t("attendanceSystem")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("attendanceSystemDesc")}
              </p>
            </div>
            
            <div className="group bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t("studentTracking")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("studentTrackingDesc")}
              </p>
            </div>
            
            <div className="group bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t("pdfReports")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("pdfReportsDesc")}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
