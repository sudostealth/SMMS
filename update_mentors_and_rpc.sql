-- Ensure mentors table has necessary columns and constraints
DO $$
BEGIN
    -- Add student_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mentors' AND column_name = 'student_id') THEN
        ALTER TABLE mentors ADD COLUMN student_id TEXT;
    END IF;

    -- Add unique constraint to student_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentors_student_id_key') THEN
        ALTER TABLE mentors ADD CONSTRAINT mentors_student_id_key UNIQUE (student_id);
    END IF;

    -- Add unique constraint to email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentors_email_key') THEN
        ALTER TABLE mentors ADD CONSTRAINT mentors_email_key UNIQUE (email);
    END IF;
END $$;


-- Create or replace the function to check availability
CREATE OR REPLACE FUNCTION check_registration_availability(p_email TEXT, p_student_id TEXT)
RETURNS TABLE (email_exists BOOLEAN, student_id_exists BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY SELECT
        EXISTS(SELECT 1 FROM mentors WHERE email = p_email) as email_exists,
        EXISTS(SELECT 1 FROM mentors WHERE student_id = p_student_id) as student_id_exists;
END;
$$;
