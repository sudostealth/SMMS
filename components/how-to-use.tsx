"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, BookOpen, Users, CalendarPlus, CheckSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HowToUse() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            size="lg"
            className="rounded-full shadow-lg group flex items-center gap-2 px-4 py-6"
            onClick={() => setOpen(true)}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            >
              <HelpCircle className="h-6 w-6" />
            </motion.div>
            <span className="font-semibold hidden group-hover:inline-block overflow-hidden transition-all duration-300">
              How to Use?
            </span>
          </Button>
        </motion.div>
      </AnimatePresence>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              How to Use Gusmp Attendance
            </DialogTitle>
            <DialogDescription>
              A quick guide to navigating and managing your dashboard effectively.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 mt-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                  <span className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    How to Create a Batch
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pl-8 space-y-2">
                  <p>1. Navigate to the <strong>Dashboard</strong> or <strong>Batches</strong> section.</p>
                  <p>2. Click the <strong>Create Batch</strong> button.</p>
                  <p>3. Fill in the required details: Batch Name, Department, Section, and Semester.</p>
                  <p>4. Save your changes to initialize the new batch. It will now appear in your active batches list.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                  <span className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-500" />
                    How to Import or Add Students
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pl-8 space-y-2">
                  <p>1. Open the specific <strong>Batch</strong> where you want to add students.</p>
                  <p>2. Go to the <strong>Students</strong> tab.</p>
                  <p>3. To add a single student, click <strong>Add Student</strong> and enter their details (Name, Enrollment No, etc.).</p>
                  <p>4. To import multiple students, click <strong>Import Students</strong> and upload a valid Excel or CSV file matching the required template format.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                  <span className="flex items-center gap-3">
                    <CalendarPlus className="h-5 w-5 text-purple-500" />
                    How to Create a Session
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pl-8 space-y-2">
                  <p>1. Inside your selected batch, navigate to the <strong>Sessions</strong> tab.</p>
                  <p>2. Click on <strong>Create Session</strong>.</p>
                  <p>3. Select the Date and specify the Subject or Topic being taught.</p>
                  <p>4. Save the session. You are now ready to take attendance for this session.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                  <span className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-orange-500" />
                    How to Take Attendance
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pl-8 space-y-2">
                  <p>1. Open an active <strong>Session</strong>.</p>
                  <p>2. You will see a list of all students enrolled in the batch.</p>
                  <p>3. Mark each student as <strong>Present</strong>, <strong>Absent</strong>, or <strong>Late</strong> using the toggle buttons.</p>
                  <p>4. The system automatically saves your changes, ensuring no data is lost.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                  <span className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-red-500" />
                    How to Download Session and Batch Reports
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pl-8 space-y-2">
                  <p>1. For a specific session report: Inside a session, click the <strong>Export</strong> or <strong>Download Report</strong> button (available in PDF or Excel).</p>
                  <p>2. For overall batch reports: Go to the <strong>Reports</strong> tab of a Batch.</p>
                  <p>3. Choose your preferred format (PDF/Docx/Excel) to download a comprehensive summary of student attendance across all sessions.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
