export interface Mentor {
  id: string;
  user_id: string;
  full_name: string;
  student_id: string;
  batch: string;
  department: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  mentor_id: string;
  batch_name: string;
  department_name: string;
  section: string;
  semester: string;
  academic_year: string;
  student_id_start?: string;
  student_id_end?: string;
  status: string;
  created_at: string;
}

export interface Student {
  id: string;
  batch_id: string;
  name: string;
  student_id: string;
  phone?: string;
  email?: string;
  created_at: string;
}

export interface Session {
  id: string;
  batch_id: string;
  session_number: number;
  session_date: string;
  method: "Online" | "Offline";
  platform?: string;
  room_number?: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  session_id: string;
  student_id: string;
  status: "Present" | "Absent";
  created_at: string;
}

export interface BatchWithStats extends Batch {
  student_count: number;
  session_count: number;
  attendance_percentage: number;
}

export interface StudentWithAttendance extends Student {
  attendance_percentage: number;
  sessions_attended: number;
  total_sessions: number;
}

export interface DashboardStats {
  total_batches: number;
  total_students: number;
  active_batches: number;
  graduated_batches: number;
}
