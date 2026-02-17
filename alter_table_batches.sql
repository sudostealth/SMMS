-- ALTER TABLE statement to add Student ID range to batches table
-- Run this command if you have an existing database that needs to be updated

-- Add student_id_start and student_id_end columns to batches table
-- These are TEXT fields to allow flexible formats (e.g., "231902001", "231-01", etc.)
ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS student_id_start TEXT,
ADD COLUMN IF NOT EXISTS student_id_end TEXT;

-- Optional: Add comments to the columns for documentation
COMMENT ON COLUMN batches.student_id_start IS 'Starting student ID in the batch range (text format)';
COMMENT ON COLUMN batches.student_id_end IS 'Ending student ID in the batch range (text format)';
