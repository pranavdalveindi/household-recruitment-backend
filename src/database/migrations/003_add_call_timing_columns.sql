ALTER TABLE IF EXISTS call_attempts
ADD COLUMN IF NOT EXISTS appointment_decision VARCHAR(50) CHECK (appointment_decision IN ('scheduled', 'rejected'));

ALTER TABLE IF EXISTS call_attempts
ADD COLUMN IF NOT EXISTS call_started_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS call_attempts
ADD COLUMN IF NOT EXISTS call_ended_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS call_attempts
ADD COLUMN IF NOT EXISTS call_duration_seconds INTEGER;

ALTER TABLE IF EXISTS call_attempts
ADD COLUMN IF NOT EXISTS questionnaire_version_id UUID REFERENCES questionnaire_versions(id);
