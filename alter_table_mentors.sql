-- ALTER TABLE statements to update existing mentors table
-- Run these commands if you have an existing database that needs to be updated

-- Step 1: Add new columns (allow NULL initially)
ALTER TABLE mentors 
ADD COLUMN IF NOT EXISTS student_id TEXT,
ADD COLUMN IF NOT EXISTS batch TEXT,
ADD COLUMN IF NOT EXISTS department TEXT;

-- Step 2: If you want to migrate data from university_id to student_id
-- UPDATE mentors SET student_id = university_id WHERE student_id IS NULL;

-- Step 3: Make columns NOT NULL (after data migration if needed)
-- First, ensure all rows have values
-- UPDATE mentors SET student_id = 'TEMPORARY' WHERE student_id IS NULL;
-- UPDATE mentors SET batch = '000' WHERE batch IS NULL;
-- UPDATE mentors SET department = 'UNK' WHERE department IS NULL;

-- Then make them NOT NULL
-- ALTER TABLE mentors ALTER COLUMN student_id SET NOT NULL;
-- ALTER TABLE mentors ALTER COLUMN batch SET NOT NULL;
-- ALTER TABLE mentors ALTER COLUMN department SET NOT NULL;

-- Step 4: Add UNIQUE constraint on student_id
-- ALTER TABLE mentors ADD CONSTRAINT mentors_student_id_key UNIQUE (student_id);

-- Step 5: Drop old university_id column (optional, after data migration)
-- ALTER TABLE mentors DROP COLUMN IF EXISTS university_id;

-- Complete one-step migration (if starting fresh or migrating all at once)
-- Uncomment the following if you want to do everything at once:

/*
ALTER TABLE mentors 
ADD COLUMN IF NOT EXISTS student_id TEXT NOT NULL DEFAULT 'TEMP',
ADD COLUMN IF NOT EXISTS batch TEXT NOT NULL DEFAULT '000',
ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT 'UNK';

ALTER TABLE mentors ADD CONSTRAINT mentors_student_id_key UNIQUE (student_id);

-- Remove defaults after adding
ALTER TABLE mentors ALTER COLUMN student_id DROP DEFAULT;
ALTER TABLE mentors ALTER COLUMN batch DROP DEFAULT;
ALTER TABLE mentors ALTER COLUMN department DROP DEFAULT;

-- Drop old column
ALTER TABLE mentors DROP COLUMN IF EXISTS university_id;
*/
