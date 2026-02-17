import { z } from "zod";

// Auth schemas
export const signUpSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  student_id: z
    .string()
    .min(9, "Student ID must be 9 digits")
    .max(9, "Student ID must be 9 digits")
    .regex(/^\d{9}$/, "Student ID must be exactly 9 digits"),
  batch: z
    .string()
    .min(3, "Batch must be 3 digits")
    .max(3, "Batch must be 3 digits")
    .regex(/^\d{3}$/, "Batch must be 3 digits (e.g., 231)"),
  department: z
    .string()
    .min(2, "Department is required")
    .max(10, "Department code too long"),
  email: z
    .string()
    .email("Invalid email address")
    .refine(
      (email) => email.endsWith("@student.green.ac.bd"),
      "Only Green University student emails (@student.green.ac.bd) are allowed"
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Batch schemas
export const createBatchSchema = z.object({
  batch_name: z.string().min(1, "Batch name is required"),
  department_name: z.string().min(1, "Department is required"),
  section: z.string().min(1, "Section is required"),
  semester: z.enum(["Spring", "Summer", "Fall"], {
    errorMap: () => ({ message: "Please select a semester" }),
  }),
  student_id_start: z.string().optional().or(z.literal("")),
  student_id_end: z.string().optional().or(z.literal("")),
});

export const updateBatchSchema = createBatchSchema.partial().extend({
  status: z.enum(["Active", "Graduated"]).optional(),
});

// Student schemas
export const createStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  student_id: z.string().min(1, "Student ID is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export const bulkStudentSchema = z.array(createStudentSchema);

// Session schemas
export const createSessionSchema = z.object({
  session_number: z.number().int().positive("Session number must be positive"),
  session_date: z.string().min(1, "Session date is required"),
  method: z.enum(["Online", "Offline"], {
    errorMap: () => ({ message: "Please select a method" }),
  }),
  platform: z.string().optional(),
  room_number: z.string().optional(),
}).refine(
  (data) => {
    if (data.method === "Online") {
      return data.platform && data.platform.length > 0;
    }
    return true;
  },
  {
    message: "Platform is required for online sessions",
    path: ["platform"],
  }
).refine(
  (data) => {
    if (data.method === "Offline") {
      return data.room_number && data.room_number.length > 0;
    }
    return true;
  },
  {
    message: "Room number is required for offline sessions",
    path: ["room_number"],
  }
);

// Attendance schema
export const markAttendanceSchema = z.object({
  student_id: z.string().uuid(),
  status: z.enum(["Present", "Absent"]),
});

export const bulkAttendanceSchema = z.array(markAttendanceSchema);

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
