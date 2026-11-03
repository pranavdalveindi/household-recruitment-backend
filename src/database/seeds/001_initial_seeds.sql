-- PanelSphere Initial Seeds
-- Seed: 001_initial_seeds.sql

-- 1. Insert Initial Regions
INSERT INTO regions (id, name, code, state, is_active)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'North Zone', 'NZ-01', 'Delhi NCR', true),
    ('a0000000-0000-0000-0000-000000000002', 'West Zone', 'WZ-02', 'Maharashtra', true),
    ('a0000000-0000-0000-0000-000000000003', 'South Zone', 'SZ-03', 'Karnataka', true),
    ('a0000000-0000-0000-0000-000000000004', 'East Zone', 'EZ-04', 'West Bengal', true)
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Development Users (Password: Password@123)
INSERT INTO users (id, name, email, password_hash, role, is_active, region_id)
VALUES 
    (
        'b0000000-0000-0000-0000-000000000001',
        'System Administrator',
        'admin@panelsphere.internal',
        '$2b$12$EMF1y82W7HfIex20VCvuDuqdIWn7yI8x7lFoCDGhK3O.u8lC4au3K',
        'admin',
        true,
        NULL
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'Priya Sharma (Panel Manager)',
        'manager@panelsphere.internal',
        '$2b$12$EMF1y82W7HfIex20VCvuDuqdIWn7yI8x7lFoCDGhK3O.u8lC4au3K',
        'panel_manager',
        true,
        'a0000000-0000-0000-0000-000000000002'
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'Rahul Verma (Call Agent)',
        'agent@panelsphere.internal',
        '$2b$12$EMF1y82W7HfIex20VCvuDuqdIWn7yI8x7lFoCDGhK3O.u8lC4au3K',
        'call_center_agent',
        true,
        'a0000000-0000-0000-0000-000000000002'
    ),
    (
        'b0000000-0000-0000-0000-000000000004',
        'Amit Patel (Field Executive)',
        'executive@panelsphere.internal',
        '$2b$12$EMF1y82W7HfIex20VCvuDuqdIWn7yI8x7lFoCDGhK3O.u8lC4au3K',
        'field_executive',
        true,
        'a0000000-0000-0000-0000-000000000002'
    )
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Initial Questionnaire Version 1
INSERT INTO questionnaire_versions (id, version_number, title, description, is_active)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    1,
    'Household Baseline Demographic & TV Setup Survey v1',
    'Standard qualification questionnaire for TV meter recruitment panel',
    true
)
ON CONFLICT (version_number) DO NOTHING;

-- 4. Insert Questionnaire Questions
INSERT INTO questionnaire_questions (id, questionnaire_version_id, question_text, question_type, options, is_required, display_order, is_active)
VALUES 
    (
        'd0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'How many working television sets are currently in the household?',
        'number',
        NULL,
        true,
        1,
        true
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000001',
        'Primary television connection type',
        'single_choice',
        '["DTH / Satellite", "Cable TV (Digital)", "IPTV / OTT Stick", "Smart TV Internet Only"]'::jsonb,
        true,
        2,
        true
    ),
    (
        'd0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        'Are all adult household members agreeable to having a meter connected to the main television?',
        'boolean',
        NULL,
        true,
        3,
        true
    ),
    (
        'd0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000001',
        'Preferred time of day for technician visit',
        'single_choice',
        '["Morning (09:00 - 12:00)", "Afternoon (12:00 - 16:00)", "Evening (16:00 - 20:00)"]'::jsonb,
        true,
        4,
        true
    )
ON CONFLICT (id) DO NOTHING;

