import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GraduationCap, Users, CalendarCheck, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">GUSMP</h1>
              <p className="text-xs text-muted-foreground">Mentor Management</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
            <p className="text-sm font-medium text-primary">
              Green University of Bangladesh
            </p>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Student Mentorship
            <span className="block text-primary mt-2">Management System</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Empowering mentors to efficiently manage batches, track student attendance,
            conduct sessions, and generate comprehensive reports.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/login">Login as Mentor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/register">Register Now</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 pt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Batch Management</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage multiple batches efficiently
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <CalendarCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Attendance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Mark and track student attendance easily
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                View comprehensive statistics and trends
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">PDF Reports</h3>
              <p className="text-sm text-muted-foreground">
                Generate detailed batch and student reports
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>&copy; 2026 Green University of Bangladesh. All rights reserved.</p>
            <p className="mt-1">Student Mentorship Program</p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Developed by</p>
            <p className="text-sm font-semibold">Md. Imam Mahdi Dsazib</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <a href="mailto:imammahdi.dsazib@gmail.com" className="hover:text-primary transition-colors">
                imammahdi.dsazib@gmail.com
              </a>
              <span>•</span>
              <a 
                href="https://github.com/immdsazib" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                @immdsazib
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
