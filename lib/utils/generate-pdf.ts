import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

// Define types locally if not available globally or import them
interface Batch {
  batch_name: string;
  department_name: string;
  section: string;
  semester: string;
  academic_year: string; // or number, based on schema
  status: string;
}

interface Student {
  id: string;
  name: string;
  student_id: string;
  email?: string;
  phone?: string;
}

interface Session {
  id: string;
  session_number: number;
  session_date: string;
  method: string;
  platform?: string;
  room_number?: string;
}

interface AttendanceRecord {
  student_id: string;
  status: "Present" | "Absent";
  session_id: string;
}

export const generateBatchReport = (
  batch: Batch,
  students: Student[],
  sessions: Session[],
  attendanceData: Record<string, AttendanceRecord[]> // keyed by session_id
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 167, 69); // Green color
  doc.text("GUSMP Batch Report", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 105, 30, { align: "center" });

  // Batch Info
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Batch Information", 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [["Batch Name", "Department", "Section", "Semester", "Status"]],
    body: [[
      batch.batch_name,
      batch.department_name,
      batch.section,
      batch.semester,
      batch.status
    ]],
    theme: 'striped',
    headStyles: { fillColor: [40, 167, 69] }
  });

  // Attendance Summary Calculation
  const studentStats = students.map(student => {
    let presentCount = 0;
    let totalSessions = sessions.length;

    sessions.forEach(session => {
      const records = attendanceData[session.id] || [];
      const record = records.find(r => r.student_id === student.id);
      if (record && record.status === "Present") {
        presentCount++;
      }
    });

    const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    return {
      name: student.name,
      id: student.student_id,
      present: presentCount,
      total: totalSessions,
      percentage: `${percentage}%`
    };
  });

  // Student Attendance Summary
  const finalY = (doc as any).lastAutoTable.finalY || 60;
  doc.setFontSize(16);
  doc.text("Student Attendance Summary", 14, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [["Student ID", "Name", "Present", "Total Sessions", "Percentage"]],
    body: studentStats.map(s => [s.id, s.name, s.present, s.total, s.percentage]),
    theme: 'grid',
    headStyles: { fillColor: [40, 167, 69] },
    columnStyles: {
      4: { fontStyle: 'bold' } // Percentage column
    }
  });

  // Detailed Session List (Optional - maybe too long for summary, but good for detailed report)
  if (sessions.length > 0) {
    const sessionsY = (doc as any).lastAutoTable.finalY || 100;
    // Add a new page if not enough space
    if (sessionsY > 250) {
        doc.addPage();
        doc.text("Session Details", 14, 20);
    } else {
        doc.text("Session Details", 14, sessionsY + 15);
    }

    const tableY = sessionsY > 250 ? 25 : sessionsY + 20;

    autoTable(doc, {
        startY: tableY,
        head: [["#", "Date", "Method", "Details", "Attendance Count"]],
        body: sessions.map(session => {
            const records = attendanceData[session.id] || [];
            const presentCount = records.filter(r => r.status === "Present").length;
            const details = session.method === "Online" ? session.platform : session.room_number;
            return [
                session.session_number,
                format(new Date(session.session_date), "PP"),
                session.method,
                details || "-",
                `${presentCount} / ${students.length}`
            ];
        }),
        theme: 'striped',
        headStyles: { fillColor: [100, 100, 100] }
    });
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Green University Student Mentorship Program', 105, 290, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 200, 290, { align: 'right' });
  }

  doc.save(`Batch_${batch.batch_name}_Report.pdf`);
};
