# EduManage — Production Full-Stack Student Management System

EduManage is a production-quality, full-stack education management platform built for modern educational institutions. It provides a centralized digital workflow for managing students, teachers, classes, course subjects, attendance registers, examinations, grades, tuition fee statements, and institutional analytics.

---

## 🚀 Key Features

### 👑 Admin Management
- **Dashboard Analytics**: Institutional KPIs (Total Students, Teachers, Classes, Avg Attendance %, Pending Fees, Upcoming Exams) with Recharts visual charts.
- **Student Management**: Complete CRUD operations, real-time search, class filtering, pagination, sorting, profile detail viewer, and confirmation dialogs.
- **Teacher Management**: Complete CRUD, department filtering, employee ID assignment, and subject allocations.
- **Class Management**: Configure academic programs (e.g., BCA, B.Tech CS), semester divisions, and academic session years (e.g., 2026-27).
- **Subject Catalog**: Manage course names, unique subject codes (e.g., `DBMS501`), and credit hours.
- **Attendance Register**: View institution-wide daily student check-in records across all lectures.
- **Examination Management**: Schedule midterms and final exams with total marks and passing benchmarks.
- **Fee Ledger**: Track tuition fee statements, partial receipts, pending balances, overdue accounts, and payment receipts.
- **Institutional Reports**: Exportable CSV reports, grade letter distributions, and departmental performance metrics.

### 👨‍🏫 Teacher Portal
- **Faculty Dashboard**: Assigned courses, today's lecture schedule, student counts, and quick actions.
- **My Students Roster**: View students enrolled in assigned classes.
- **Daily Attendance Marking**: Select Class → Subject → Date → Student List → Mark Present / Absent / Late → Save with anti-duplicate enforcement.
- **Examination Marks Entry**: Enter student scores for scheduled exams with automated institutional letter grade calculation (`A+`, `A`, `B+`, `B`, `C`, `D`, `F`).

### 🎓 Student Portal
- **Personalized Student Dashboard**: Welcome banner, overall attendance percentage, CGPA score, pending fee balance, and upcoming exam notices.
- **My Profile**: Institutional student ID, class batch, contact details, date of birth, and home address.
- **My Attendance Record**: Overall attendance percentage (`Present / Total × 100`) and subject-wise breakdown table.
- **My Exam Results**: Exam scores, letter grades, passing status, and semester GPA.
- **Fee Statements**: Tuition fee balance, due date, status, payment receipt history, and instant online payment simulation.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Icons & Visuals**: Lucide React icons, Recharts visualization library
- **Backend**: Node.js, Next.js API Route Handlers
- **Database**: PostgreSQL
- **ORM**: Prisma ORM v5
- **Validation**: Zod schema validation
- **Authentication**: JWT session tokens with `jose`, `bcryptjs` password hashing, httpOnly secure cookies, Next.js Edge Middleware route protection.

---

## 🔒 Security & Authorization

- **Password Hashing**: All passwords securely hashed using `bcryptjs` (salt rounds = 10). Passwords are never stored in plain text.
- **Role-Based Access Control (RBAC)**: Backend API authorization enforcing permissions for `ADMIN`, `TEACHER`, and `STUDENT`.
- **Edge Middleware**: Next.js middleware protecting `/admin/*`, `/teacher/*`, `/student/*` routes against unauthorized URL tampering.

---

## 🔑 Demo Login Credentials

For quick evaluation, one-click demo login buttons are available on the `/login` page:

| Role | Email | Password | Access Path |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@edumanage.com` | `admin123` | `/admin/dashboard` |
| **Teacher 1** | `sarah.jenkins@edumanage.com` | `teacher123` | `/teacher/dashboard` |
| **Teacher 2** | `robert.chen@edumanage.com` | `teacher123` | `/teacher/dashboard` |
| **Student 1** | `rahul.sharma@edumanage.com` | `student123` | `/student/dashboard` |
| **Student 2** | `aman.kumar@edumanage.com` | `student123` | `/student/dashboard` |

---

## 📂 Project Structure

```text
edumanage/
├── app/
│   ├── admin/             # Admin portal (dashboard, students, teachers, classes, subjects, attendance, exams, fees, reports)
│   ├── teacher/           # Teacher portal (dashboard, students, attendance, examinations)
│   ├── student/           # Student portal (dashboard, profile, attendance, results, fees)
│   ├── api/               # API route handlers (auth, students, teachers, classes, subjects, attendance, exams, results, fees)
│   ├── login/             # Authentication login page
│   ├── globals.css        # Tailwind CSS & animations
│   ├── layout.tsx         # Root HTML layout
│   └── page.tsx           # Home redirect to login
├── components/            # Reusable UI components (DataTable, Modal, Button, Input, Select, Badge, Sidebar, Navbar, Toast, etc.)
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # Password hashing & JWT session management
│   ├── db.ts              # Unified database services (Prisma + PostgreSQL)
│   ├── validations.ts     # Zod schema definitions
│   └── permissions.ts     # Authorization helpers
├── prisma/
│   ├── schema.prisma      # PostgreSQL Prisma relational database schema
│   └── seed.ts            # Initial seed dataset generator
├── public/                # Static assets
├── middleware.ts          # Edge middleware for route protection
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## ⚙️ Getting Started & Setup

### 1. Prerequisites
- Node.js v18+ and npm
- PostgreSQL database server running locally or remotely

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/edumanage?schema=public"
JWT_SECRET="edumanage_production_jwt_secret_key_2026_super_secure"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Migration & Seeding
Generate Prisma client, push PostgreSQL migrations, and run the seed script:
```bash
# Generate Prisma Client
npx prisma generate

# Push database schema to PostgreSQL
npx prisma db push

# Seed initial database
npm run seed
```

### 4. Running Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🔌 API Overview

| Method | Endpoint | Description | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & set session cookie | Public |
| `POST` | `/api/auth/logout` | Clear session cookie | Authenticated |
| `GET` | `/api/auth/me` | Fetch current session profile | Authenticated |
| `GET/POST` | `/api/students` | Get list or create student | ADMIN, TEACHER |
| `GET/PUT/DELETE` | `/api/students/:id` | View, update, delete student | ADMIN, STUDENT (Self GET) |
| `GET/POST` | `/api/teachers` | Get list or create teacher | ADMIN |
| `PUT/DELETE` | `/api/teachers/:id` | Update or delete teacher | ADMIN |
| `GET/POST` | `/api/classes` | Get list or create class | ADMIN, TEACHER, STUDENT |
| `PUT/DELETE` | `/api/classes/:id` | Update or delete class | ADMIN |
| `GET/POST` | `/api/subjects` | Get list or create subject | ADMIN, TEACHER, STUDENT |
| `GET/POST` | `/api/attendance` | Fetch or mark attendance | ADMIN, TEACHER, STUDENT (Self GET) |
| `GET/POST` | `/api/exams` | Fetch or create examination | ADMIN, TEACHER, STUDENT |
| `GET/POST` | `/api/results` | Fetch or save exam results | ADMIN, TEACHER, STUDENT (Self GET) |
| `GET/POST` | `/api/fees` | Fetch or issue fee records | ADMIN, STUDENT (Self GET) |
| `POST` | `/api/fees/pay` | Record fee payment transaction | ADMIN, STUDENT |

---

## 📄 License
EduManage is open-source software licensed under the MIT License.
