# PanelSphere - Backend Application

**PanelSphere** is an enterprise Household Panel Recruitment & Management System backend API built with Node.js, Express.js, TypeScript, and PostgreSQL.

## Architectural Principles

1. **Feature-Based Modular Structure**: Every business feature lives in its own module under `src/modules/<feature>/` containing its dedicated routes, controllers, services, validation schemas, and types.
2. **Database Integrity**: Connects to PostgreSQL using standard `pg` pool. Works identically on Supabase-hosted PostgreSQL and AWS RDS PostgreSQL via `DATABASE_URL`.
3. **Application-Managed Security**: Uses bcrypt for password hashing and JWT for stateless authentication. Supabase Auth is strictly avoided.
4. **Strict Server-Side Authorization**: Role-based access control (Admin, Panel Manager, Call Center Agent, Field Executive) enforced via middleware and services.
5. **OpenAPI / Swagger Documentation**: Interactive API documentation served at `/api-docs`.

## Backend Directory Structure

```text
hh-recruitment-backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   ├── cors.ts
│   │   └── swagger.ts
│   ├── database/
│   │   ├── connection.ts
│   │   ├── migrations/
│   │   └── seeds/
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── error-handler.ts
│   │   ├── not-found.ts
│   │   ├── request-logger.ts
│   │   └── validate.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── region/
│   │   ├── household/
│   │   ├── household-member/
│   │   ├── questionnaire/
│   │   ├── call/
│   │   ├── appointment/
│   │   ├── installation/
│   │   ├── rejection/
│   │   ├── import/
│   │   ├── report/
│   │   ├── dashboard/
│   │   ├── note/
│   │   └── audit/
│   ├── routes/
│   │   └── index.ts
│   ├── services/
│   │   ├── user/
│   │   ├── notification/
│   │   └── file/
│   ├── types/
│   └── utils/
├── docs/
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure `DATABASE_URL` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/panelsphere?sslmode=disable
JWT_SECRET=your_secure_random_jwt_secret_at_least_32_characters
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The API will be available at: `http://localhost:4000/api/v1`
Interactive Swagger Documentation: `http://localhost:4000/api-docs`

### 4. Build and Run Production

```bash
npm run build
npm start
```

