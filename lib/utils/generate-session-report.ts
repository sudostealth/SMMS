import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun, BorderStyle, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const svgToPngDataUrl = async (svgUrl: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
};

interface Batch {
  batch_name: string;
  department_name: string;
  section: string;
  semester: string;
  student_id_start?: string;
  student_id_end?: string;
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

  try {
    const gubLogoDataUrl = await svgToPngDataUrl("/GUBLogo.svg", 200, 200);
    // Add logo at the top center
    doc.addImage(gubLogoDataUrl, "PNG", 95, 10, 20, 20);
  } catch (error) {
    console.error("Failed to load logos for PDF", error);
  }

  // Header Text
  doc.setFontSize(16);
  doc.setFont("times", "bold");
  doc.text("Green University Student Mentorship Program", 105, 36, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("times", "bold");
  doc.text(`Department of ${batch.department_name}`, 105, 44, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("Green University of Bangladesh", 105, 52, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(14, 58, 196, 58);

  // Split details into two columns
  doc.setFontSize(10);
  doc.setFont("times", "normal");

  // Left Column
  let startY = 66;
  let lineSpacing = 6;
  doc.text(`Mentor Name: ${mentorName}`, 14, startY);

  // Use ID range from batch configuration
  const idRange = batch.student_id_start && batch.student_id_end
    ? `${batch.student_id_start} - ${batch.student_id_end}`
    : "N/A";

  // Sort students for table
  const sortedStudents = [...students].sort((a, b) => a.student_id.localeCompare(b.student_id));

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
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', font: 'times' },
    styles: { cellPadding: 3, fontSize: 10, minCellHeight: 12, valign: "middle", font: 'times' },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 70 },
      2: { cellWidth: 35 },
      3: { cellWidth: 40 }
    },
  });

  // Add signatures only at the end of the document (last page)
  const finalY = (doc as any).lastAutoTable.finalY || startY + lineSpacing * 5 + 5;
  const pageHeight = doc.internal.pageSize.height;

  // If there's not enough space for signatures, add a new page
  if (finalY + 40 > pageHeight) {
    doc.addPage();
  }

  const signatureY = doc.internal.pageSize.height - 30;

  doc.setLineWidth(0.5);
  // Left signature
  doc.line(14, signatureY, 74, signatureY);
  doc.text("Mentor Moderator", 44, signatureY + 5, { align: "center" });
  doc.text(`Dept. of ${batch.department_name}`, 44, signatureY + 10, { align: "center" });

  // Right signature
  doc.line(136, signatureY, 196, signatureY);
  doc.text("Chairperson", 166, signatureY + 5, { align: "center" });
  doc.text(`Dept. of ${batch.department_name}`, 166, signatureY + 10, { align: "center" });

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

  // Use ID range from batch configuration
  const idRange = batch.student_id_start && batch.student_id_end
    ? `${batch.student_id_start} - ${batch.student_id_end}`
    : "N/A";

  const location = session.method === "Online" ? session.platform : `Room ${session.room_number}`;

  let logoParagraphs: Paragraph[] = [];
  try {
    const gubLogoDataUrl = await svgToPngDataUrl("/GUBLogo.svg", 100, 100);

    // Extract base64 part
    const gubBase64 = gubLogoDataUrl.split(',')[1];

    // Decode base64 to ArrayBuffer
    const gubBuffer = Uint8Array.from(atob(gubBase64), c => c.charCodeAt(0)).buffer;

    logoParagraphs = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: gubBuffer,
            transformation: { width: 50, height: 50 },
            type: "png"
          }),
        ],
      }),
    ];
  } catch (error) {
    console.error("Failed to load logos for DOCX", error);
  }

  const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Times New Roman",
                },
            },
        },
    },
    sections: [
      {
        properties: {},
        children: [
          ...logoParagraphs,
          new Paragraph({
            children: [
              new TextRun({ text: "Green University Student Mentorship Program", bold: true, size: 32 }) // 16pt
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Department of ${batch.department_name}`, bold: true, size: 28 }) // 14pt
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Green University of Bangladesh", bold: true, size: 24 }) // 12pt
            ],
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
                      new Paragraph({ text: "________________________________", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "Mentor Moderator", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: `Dept. of ${batch.department_name}`, alignment: AlignmentType.CENTER }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: "________________________________", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "Chairperson", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: `Dept. of ${batch.department_name}`, alignment: AlignmentType.CENTER }),
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
