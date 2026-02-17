"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/services/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  PlusCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { Mentor } from "@/types";

interface DashboardSidebarProps {
  mentor: Mentor;
}

export default function DashboardSidebar({ mentor }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard") },
    { href: "/batches", icon: Users, label: t("batches") },
    { href: "/create-batch", icon: PlusCircle, label: t("createBatch") },
    { href: "/profile", icon: User, label: t("profileSettings") },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast({
        title: "Logged out", // I should translate this too if possible, but toast content is often dynamic
        description: t("logout") + " successful.", // Imperfect translation
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast({
        title: t("error"),
        description: "Failed to logout",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">GUSMP</span>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r",
          "transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 p-6 border-b">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-primary">GUSMP</h1>
              <p className="text-xs text-muted-foreground">{t("mentorPortal")}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b mt-16 lg:mt-0">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{mentor.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{mentor.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    isActive && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <div className="flex items-center justify-between px-2">
               <LanguageToggle />
               <div className="hidden lg:block">
                <ThemeToggle />
               </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
