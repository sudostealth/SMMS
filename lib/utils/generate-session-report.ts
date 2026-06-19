import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun, BorderStyle, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

interface Batch {
  batch_name: string;
  department_name: string;
  section: string;
  semester: string;
}

interface Student {
  id: string;
  name: string;
  student_id: string;
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

const loadLogo = async (url: string): Promise<string> => {
  try {
    // If it's a relative URL, fetch it from our origin
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to load logo");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading logo:", error);
    return ""; // Return empty string on failure
  }
};


export const generateSessionReportPdf = async (
  batch: Batch,
  students: Student[],
  session: Session,
  attendanceRecords: AttendanceRecord[],
  mentorName: string = "Unknown Mentor"
) => {
  const doc = new jsPDF();

  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
  const absentCount = students.length - presentCount;

  // Add logos if possible (will skip if it fails)
  // For jsPDF, we can't easily add SVG directly without canvas. We'll add text for the header.

  // Header Text
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Green University Student Mentorship Program", 105, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Department of Computer Science & Engineering", 105, 28, { align: "center" });

  doc.setFontSize(12);
  doc.text("Green University of Bangladesh", 105, 36, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // Split details into two columns
  doc.setFontSize(10);

  // Left Column
  let startY = 50;
  let lineSpacing = 6;
  doc.text(`Mentor Name: ${mentorName}`, 14, startY);

  // Sort students to find ID range
  const sortedStudents = [...students].sort((a, b) => a.student_id.localeCompare(b.student_id));
  const idRange = sortedStudents.length > 0 ? `${sortedStudents[0].student_id} - ${sortedStudents[sortedStudents.length - 1].student_id}` : "N/A";

  doc.text(`Student ID Range: ${idRange}`, 14, startY + lineSpacing);
  doc.text(`Semester: ${batch.semester}`, 14, startY + lineSpacing * 2);
  doc.text(`Batch: ${batch.batch_name}`, 14, startY + lineSpacing * 3);
  doc.text(`Section: ${batch.section}`, 14, startY + lineSpacing * 4);

  // Right Column
  doc.text(`Total Students: ${students.length}`, 120, startY);
  doc.text(`Total Present: ${presentCount}`, 120, startY + lineSpacing);
  doc.text(`Total Absent: ${absentCount}`, 120, startY + lineSpacing * 2);
  doc.text(`Session Date & Time: ${format(new Date(session.session_date), "PPpp")}`, 120, startY + lineSpacing * 3);
  const location = session.method === "Online" ? session.platform : `Room ${session.room_number}`;
  doc.text(`Location: ${session.method} - ${location || "N/A"}`, 120, startY + lineSpacing * 4);

  // Students Table
  const tableData = sortedStudents.map((student) => {
    const record = attendanceRecords.find((r) => r.student_id === student.id);
    const status = record ? record.status : "Absent"; // Default to absent if no record
    return [student.student_id, student.name, status, ""];
  });

  autoTable(doc, {
    startY: startY + lineSpacing * 5 + 5,
    head: [["Student ID", "Student Name", "Present/Absent", "Student Signature"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { cellPadding: 3, fontSize: 10, minCellHeight: 12, valign: "middle" },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 70 },
      2: { cellWidth: 35 },
      3: { cellWidth: 40 }
    },
    didDrawPage: (data) => {
        // Signatures at the bottom
        const pageHeight = doc.internal.pageSize.height;
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setPage(pageCount);

        doc.setLineWidth(0.5);
        doc.line(14, pageHeight - 30, 74, pageHeight - 30);
        doc.text("Mentor Moderator, Dept. of CSE", 14, pageHeight - 25);

        doc.line(136, pageHeight - 30, 196, pageHeight - 30);
        doc.text("Chairperson, Dept. of CSE", 136, pageHeight - 25);
    }
  });


  doc.save(`Session_${session.session_number}_Report.pdf`);
};

export const generateSessionReportDocx = async (
  batch: Batch,
  students: Student[],
  session: Session,
  attendanceRecords: AttendanceRecord[],
  mentorName: string = "Unknown Mentor"
) => {

  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
  const absentCount = students.length - presentCount;
  const sortedStudents = [...students].sort((a, b) => a.student_id.localeCompare(b.student_id));
  const idRange = sortedStudents.length > 0 ? `${sortedStudents[0].student_id} - ${sortedStudents[sortedStudents.length - 1].student_id}` : "N/A";
  const location = session.method === "Online" ? session.platform : `Room ${session.room_number}`;

  // Logos (skipping images for DOCX since it requires ArrayBuffer of image which might be tricky in browser without CORS issues if fetching SVGs)
  // We'll rely on text for DOCX for now for simplicity and reliability.

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Green University Student Mentorship Program",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "Department of Computer Science & Engineering",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "Green University of Bangladesh",
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Info table to create two columns
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph(`Mentor Name: ${mentorName}`),
                      new Paragraph(`Student ID Range: ${idRange}`),
                      new Paragraph(`Semester: ${batch.semester}`),
                      new Paragraph(`Batch: ${batch.batch_name}`),
                      new Paragraph(`Section: ${batch.section}`),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(`Total Students: ${students.length}`),
                      new Paragraph(`Total Present: ${presentCount}`),
                      new Paragraph(`Total Absent: ${absentCount}`),
                      new Paragraph(`Session Date & Time: ${format(new Date(session.session_date), "PPpp")}`),
                      new Paragraph(`Location: ${session.method} - ${location || "N/A"}`),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 400 } }), // spacer

          // Main Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Student ID", style: "Strong" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Student Name", style: "Strong" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Present/Absent", style: "Strong" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Student Signature", style: "Strong" })] }),
                ],
              }),
              ...sortedStudents.map(student => {
                  const record = attendanceRecords.find((r) => r.student_id === student.id);
                  const status = record ? record.status : "Absent";
                  return new TableRow({
                      children: [
                          new TableCell({ children: [new Paragraph(student.student_id)] }),
                          new TableCell({ children: [new Paragraph(student.name)] }),
                          new TableCell({ children: [new Paragraph(status)] }),
                          new TableCell({ children: [new Paragraph("")] }), // Empty for signature
                      ]
                  });
              })
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 800 } }), // spacer before signatures

          // Signatures table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph("________________________________"),
                      new Paragraph("Mentor Moderator, Dept. of CSE"),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: "________________________________", alignment: AlignmentType.RIGHT }),
                      new Paragraph({ text: "Chairperson, Dept. of CSE", alignment: AlignmentType.RIGHT }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Session_${session.session_number}_Report.docx`);
};
