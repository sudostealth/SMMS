-- GUSMP Mentor Management System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create mentors table
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  university_id TEXT NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create batches table
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE NOT NULL,
  batch_name TEXT NOT NULL,
  department_name TEXT NOT NULL,
  section TEXT NOT NULL,
  semester TEXT NOT NULL CHECK (semester IN ('Spring', 'Summer', 'Fall')),
  student_id_start TEXT,
  student_id_end TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Graduated')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  batch TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(batch_id, student_id)
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE NOT NULL,
  session_number INTEGER NOT NULL,
  session_date DATE NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('Online', 'Offline')),
  platform TEXT,
  room_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(batch_id, session_number)
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_batches_mentor_id ON batches(mentor_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_students_batch_id ON students(batch_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_sessions_batch_id ON sessions(batch_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_attendance_session_id ON attendance(session_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);

-- Enable Row Level Security (RLS)
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentors table
CREATE POLICY "Mentors can view own profile"
  ON mentors FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Mentors can update own profile"
  ON mentors FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Mentors can insert own profile"
  ON mentors FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- RLS Policies for batches table
CREATE POLICY "Mentors can view own batches"
  ON batches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mentors
      WHERE mentors.id = batches.mentor_id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can insert own batches"
  ON batches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM mentors
      WHERE mentors.id = batches.mentor_id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can update own batches"
  ON batches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM mentors
      WHERE mentors.id = batches.mentor_id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can delete own batches"
  ON batches FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM mentors
      WHERE mentors.id = batches.mentor_id
      AND mentors.auth_user_id = auth.uid()
    )
  );

-- RLS Policies for students table
CREATE POLICY "Mentors can view students in own batches"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM batches
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE students.batch_id = batches.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can insert students in own batches"
  ON students FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM batches
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE students.batch_id = batches.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can update students in own batches"
  ON students FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM batches
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE students.batch_id = batches.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can delete students in own batches"
  ON students FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM batches
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE students.batch_id = batches.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

-- RLS Policies for sessions table
CREATE POLICY "Mentors can view sessions in own batches"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM batches
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE sessions.batch_id = batches.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can insert sessions in own batches"
  ON sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM batches
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE sessions.batch_id = batches.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can update sessions in own batches"
  ON sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM batches
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE sessions.batch_id = batches.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can delete sessions in own batches"
  ON sessions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM batches
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE sessions.batch_id = batches.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

-- RLS Policies for attendance table
CREATE POLICY "Mentors can view attendance in own batches"
  ON attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      INNER JOIN batches ON sessions.batch_id = batches.id
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE attendance.session_id = sessions.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can insert attendance in own batches"
  ON attendance FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      INNER JOIN batches ON sessions.batch_id = batches.id
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE attendance.session_id = sessions.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can update attendance in own batches"
  ON attendance FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      INNER JOIN batches ON sessions.batch_id = batches.id
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE attendance.session_id = sessions.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can delete attendance in own batches"
  ON attendance FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      INNER JOIN batches ON sessions.batch_id = batches.id
      INNER JOIN mentors ON batches.mentor_id = mentors.id
      WHERE attendance.session_id = sessions.id
      AND mentors.auth_user_id = auth.uid()
    )
  );

-- Trigger function to automatically create mentor profile
CREATE OR REPLACE FUNCTION public.create_mentor_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.mentors (user_id, full_name, student_id, batch, department, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'student_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'batch', ''),
    COALESCE(NEW.raw_user_meta_data->>'department', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create mentor profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_mentor_profile();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
