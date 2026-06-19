-- Drop the existing constraint
ALTER TABLE batches DROP CONSTRAINT IF EXISTS batches_status_check;

-- Add the new constraint
ALTER TABLE batches ADD CONSTRAINT batches_status_check CHECK (status IN ('Active', 'Inactive', 'Completed', 'Graduated'));
