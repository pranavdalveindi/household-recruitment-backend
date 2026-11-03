# PanelSphere - Project Context

## Project Name
**PanelSphere** — Household Panel Recruitment & Management System

## Core Purpose
PanelSphere manages the full lifecycle of household recruitment for television audience measurement panels:
1. **Recruitment Information Ingestion**: Bulk CSV parsing with 10 members per row, format validation, duplicate prevention.
2. **Call-Center Operations**: Contact logging with external calling workflow, questionnaire execution across versioned templates, and appointment decisions.
3. **Appointment Scheduling & Rescheduling**: Audited scheduling, field executive assignment, and instruction management.
4. **Field Executive Visit Management**: Mobile-ready visit logging with TV meter installation confirmation, rejection reasons, or flagged installation issues.
5. **Quality Control & Permanent Rejection**: Audited household rejection preserving demographic snapshots.
6. **Replacement Household Matching**: Weighted demographic matching to rapidly identify similar uncontacted candidate households.
7. **Role-Based Operations & Reporting**: Admin, Panel Manager, Call Center Agent, and Field Executive portals with audit trails.

## Independent Repositories
The system is divided into two separate GitHub repositories:
- `hh-recruitment-frontend`: Next.js 15 App Router, Tailwind CSS, Lucide React, Recharts, React Hook Form, Zod.
- `hh-recruitment-backend`: Node.js, Express.js, TypeScript, PostgreSQL (standard `pg` client), Swagger/OpenAPI.

