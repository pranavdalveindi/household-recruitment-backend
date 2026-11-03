# PanelSphere - Database Schema Design

## Target DBMS
PostgreSQL 14+ (Compatible with Supabase PostgreSQL and AWS RDS PostgreSQL via standard `pg` connection string).

## Core Logical Entities

### 1. `regions`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `name` VARCHAR(100) NOT NULL UNIQUE
- `code` VARCHAR(20) NOT NULL UNIQUE
- `state` VARCHAR(100) NOT NULL
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 2. `users`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `name` VARCHAR(150) NOT NULL
- `email` VARCHAR(255) NOT NULL UNIQUE
- `password_hash` VARCHAR(255) NOT NULL
- `role` VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'panel_manager', 'call_center_agent', 'field_executive'))
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `region_id` UUID REFERENCES regions(id) ON DELETE SET NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 3. `households`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `hhid` VARCHAR(50) NOT NULL UNIQUE
- `respondent_name` VARCHAR(150) NOT NULL
- `contact_number` VARCHAR(30) NOT NULL
- `alternate_contact_number` VARCHAR(30)
- `address` TEXT NOT NULL
- `landmark` VARCHAR(255)
- `city` VARCHAR(100) NOT NULL
- `region_id` UUID NOT NULL REFERENCES regions(id)
- `location` VARCHAR(150)
- `sec` INTEGER NOT NULL CHECK (sec >= 1)
- `mosr` INTEGER NOT NULL CHECK (mosr >= 0)
- `recruitment_status` VARCHAR(50) NOT NULL DEFAULT 'not_contacted' CHECK (recruitment_status IN ('not_contacted', 'contact_in_progress', 'appointment_pending', 'appointment_scheduled', 'installation_in_progress', 'installed', 'rejected'))
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 4. `household_members`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `household_id` UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE
- `name` VARCHAR(150) NOT NULL
- `age` INTEGER NOT NULL CHECK (age >= 0 AND age <= 125)
- `gender` VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other'))
- `relationship_to_respondent` VARCHAR(100) NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 5. `questionnaire_versions`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `version_number` INTEGER NOT NULL UNIQUE
- `title` VARCHAR(200) NOT NULL
- `description` TEXT
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 6. `questionnaire_questions`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `questionnaire_version_id` UUID NOT NULL REFERENCES questionnaire_versions(id) ON DELETE CASCADE
- `question_text` TEXT NOT NULL
- `question_type` VARCHAR(50) NOT NULL CHECK (question_type IN ('text', 'number', 'boolean', 'single_choice', 'multiple_choice', 'date'))
- `options` JSONB
- `is_required` BOOLEAN NOT NULL DEFAULT true
- `display_order` INTEGER NOT NULL DEFAULT 1
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 7. `call_attempts`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `household_id` UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE
- `agent_id` UUID NOT NULL REFERENCES users(id)
- `call_status` VARCHAR(50) NOT NULL CHECK (call_status IN ('successful', 'not_reachable', 'busy'))
- `appointment_decision` VARCHAR(50) CHECK (appointment_decision IN ('scheduled', 'rejected'))
- `call_started_at` TIMESTAMPTZ
- `call_ended_at` TIMESTAMPTZ
- `call_duration_seconds` INTEGER
- `notes` TEXT
- `questionnaire_version_id` UUID REFERENCES questionnaire_versions(id)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 8. `call_responses`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `call_attempt_id` UUID NOT NULL REFERENCES call_attempts(id) ON DELETE CASCADE
- `question_id` UUID NOT NULL REFERENCES questionnaire_questions(id)
- `response_value` JSONB NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 9. `appointments`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `household_id` UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE
- `field_executive_id` UUID NOT NULL REFERENCES users(id)
- `appointment_date` DATE NOT NULL
- `appointment_time` TIME NOT NULL
- `status` VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'rescheduled', 'cancelled', 'completed', 'rejected'))
- `household_instructions` TEXT
- `rescheduled_from_appointment_id` UUID REFERENCES appointments(id)
- `created_by` UUID NOT NULL REFERENCES users(id)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 10. `appointment_status_history`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `appointment_id` UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE
- `previous_status` VARCHAR(50)
- `new_status` VARCHAR(50) NOT NULL
- `changed_by` UUID NOT NULL REFERENCES users(id)
- `notes` TEXT
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 11. `installation_visits`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `household_id` UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE
- `appointment_id` UUID REFERENCES appointments(id)
- `field_executive_id` UUID NOT NULL REFERENCES users(id)
- `visit_date` TIMESTAMPTZ NOT NULL
- `status` VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'installed', 'rejected', 'issue'))
- `rejection_reason` TEXT
- `issue_category` VARCHAR(100)
- `issue_description` TEXT
- `notes` TEXT
- `meter_serial_number` VARCHAR(100)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 12. `household_rejections`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `household_id` UUID NOT NULL UNIQUE REFERENCES households(id) ON DELETE CASCADE
- `rejected_by` UUID NOT NULL REFERENCES users(id)
- `reason` TEXT NOT NULL
- `demographic_snapshot` JSONB NOT NULL
- `rejection_date` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 13. `household_notes`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `household_id` UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE
- `author_id` UUID NOT NULL REFERENCES users(id)
- `note_type` VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'contact_instruction', 'installation_instruction', 'other'))
- `content` TEXT NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 14. `household_status_history`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `household_id` UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE
- `previous_status` VARCHAR(50)
- `new_status` VARCHAR(50) NOT NULL
- `changed_by` UUID NOT NULL REFERENCES users(id)
- `notes` TEXT
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 15. `import_batches`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `filename` VARCHAR(255) NOT NULL
- `total_rows` INTEGER NOT NULL DEFAULT 0
- `successful_rows` INTEGER NOT NULL DEFAULT 0
- `failed_rows` INTEGER NOT NULL DEFAULT 0
- `imported_by` UUID NOT NULL REFERENCES users(id)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 16. `import_batch_rows`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `import_batch_id` UUID NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE
- `household_id` UUID REFERENCES households(id)
- `row_index` INTEGER NOT NULL
- `hhid` VARCHAR(50) NOT NULL
- `is_successful` BOOLEAN NOT NULL DEFAULT true
- `error_message` TEXT
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 17. `audit_logs`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID REFERENCES users(id) ON DELETE SET NULL
- `action` VARCHAR(100) NOT NULL
- `entity_type` VARCHAR(100) NOT NULL
- `entity_id` VARCHAR(100) NOT NULL
- `previous_values` JSONB
- `new_values` JSONB
- `metadata` JSONB
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

