# Session State — 2026-07-02

## 📁 Project Structure
```
renemunyeshyaka.github.io/                    # GitHub Pages repo
├── .gitignore                                 # ✅ Created — root-level, covers everything
├── NewRequirements.txt                        # Revised portal requirements (services model)
├── README.md                                  # Full project overview
├── redesign.md                                # Portfolio redesign plan
├── Uploads.zip                                # Zipped portfolio backup
└── kcoders-portal/
    ├── .gitignore                             # ❌ Deleted — merged into root .gitignore
    ├── docker-compose.yml                     # Postgres + backend + frontend
    ├── backend/
    │   ├── .env                               # ✅ Created — local dev env vars
    │   ├── .env.example                       # ✅ Created — safe-to-commit template
    │   ├── go.mod
    │   ├── cmd/server/main.go                 # Gin server, routes, DB auto-migrate
    │   ├── internal/
    │   │   ├── auth/ (jwt.go, otp.go)
    │   │   ├── handlers/ (admin, auth, course, enrollment, ticket, visit)
    │   │   ├── middleware/ (auth.go, ratelimit.go)
    │   │   ├── models/ (batch, certificate, course, enrollment, otp, payment, ticket, user, visit)
    │   │   └── utils/ (email.go, upload.go)
    │   └── migrations/001_init.sql            # Full DB schema (LMS model)
    ├── frontend/
    │   ├── package.json                       # Next.js 14 + React 18 + Tailwind
    │   ├── app/
    │   │   ├── layout.tsx, page.tsx, globals.css
    │   │   └── (portal)/                      # Client portal pages
    │   │       ├── admin/page.tsx
    │   │       ├── courses/page.tsx
    │   │       ├── dashboard/page.tsx
    │   │       ├── enroll/page.tsx
    │   │       ├── enrollment-success/page.tsx
    │   │       ├── login/page.tsx
    │   │       ├── register/page.tsx
    │   │       └── tickets/page.tsx
    │   ├── components/ (portal/, shared/ layout components)
    │   └── lib/ (api.ts, auth-context.tsx)
    ├── portfolio/                             # Static portfolio website
    │   ├── index.html                         # Redesigned portfolio
    │   ├── css/ (style.css, animations.css)
    │   ├── js/ (main.js, projects.js)
    │   ├── images/
    │   └── Uploads/                           # Duplicate/copy of portfolio
    ├── scripts/ (backup.sh, migrate.sh)
    └── storage/ (backups/, uploads/)
```

---

## ✅ What's Been Done Today

### Configuration Files
- [x] Created root `.gitignore` (comprehensive, covers all sub-projects)
- [x] Deleted `kcoders-portal/.gitignore` (merged into root)
- [x] Created `kcoders-portal/backend/.env` (local dev, PORT=5003)
- [x] Created `kcoders-portal/backend/.env.example` (safe-to-commit template)
- [x] Harmonized PORT=5003 / FRONTEND_URL=http://localhost:3003 across `.env`, `.env.example`, and `docker-compose.yml`

### Dockerfiles
- [x] Created `backend/Dockerfile` (multi-stage Go build → alpine)
- [x] Created `frontend/Dockerfile` (multi-stage Next.js build)

### Static Path Fix
- [x] Made storage path configurable via `STORAGE_PATH` env var in `main.go` and `upload.go`
- [x] Added `STORAGE_PATH` to docker-compose backend service

### 🚀 Major: LMS → Services Portal Refactor
**Backend compiles cleanly with zero errors.**

#### Models
- [x] Created `service.go` — replaces `Course` (has category, no pricing in model — pricing is per-project)
- [x] Created `project.go` — replaces `Enrollment` (brief → proposal → active → completed lifecycle)
- [x] Created `milestone.go` — replaces `Payment` (milestone-based payments per project)
- [x] Updated `user.go` — added `WhatsApp`, `TOTPSecret` fields
- [x] Updated `ticket.go` — added optional `ProjectID` link
- [x] Updated `otp.go` — added `DeviceToken`/`DeviceExpires` for "remember this device" (30 days)
- [x] Deleted: `course.go`, `enrollment.go`, `batch.go`, `certificate.go`, `payment.go`

#### Handlers
- [x] Created `service_handler.go` — CRUD for services (public list, admin manage)
- [x] Created `project_handler.go` — submit brief, list my projects, dashboard, document upload
- [x] Updated `auth_handler.go` — TOTP secret generation on register, "remember device" in OTP verify
- [x] Rewrote `admin_handler.go` — dashboard uses services/projects/milestones, verify milestones, sign-off deliverables
- [x] Updated `ticket_handler.go` — removed unused import

#### Routes
| Old Route | New Route |
|-----------|-----------|
| `GET /api/courses` | `GET /api/services` |
| `POST /api/enroll` | `POST /api/projects/brief` |
| `GET /api/enrollments` | `GET /api/projects` |
| `GET /api/dashboard` | `GET /api/dashboard` (uses ProjectHandler) |
| `PUT /admin/enrollments/:id/verify-payment` | `PUT /admin/milestones/:id/verify` |
| `POST /admin/certificates/issue` | `PUT /admin/milestones/:id/sign-off` |
| — (new) | `PUT /admin/projects/:id/status` (with developer assignment) |

#### Migration SQL
- [x] Rewrote `001_init.sql` with new schema: `services`, `projects`, `milestones` tables
- [x] Seed data for 7 default services matching the requirements

---

## 📋 Remaining Tasks

### Portfolio (kcoders-portal/portfolio/)
**Status:** Redesigned HTML/CSS/JS exists. Polish phase remaining.
- [ ] Add more project screenshots/assets to `portfolio/images/`
- [ ] Create product mockup images if missing (LandVal, CV Builder, Kcoders Portal)
- [ ] Fine-tune responsive breakpoints
- [ ] Accessibility audit (ARIA labels, keyboard navigation)
- [ ] Performance audit (Lighthouse 90+)
- [ ] Deploy to GitHub Pages
- [ ] Test all links and forms
- [ ] Configure custom domain if needed

### AI Chat Assistant (Portfolio)
- [ ] Set up LLM endpoint for chat responses
- [ ] Build floating chat widget with WebSocket
- [ ] Implement lead capture & storage
- [ ] Connect email notification system
- [ ] Deploy chat widget on portfolio

### Kcoders Portal — Backend (Go/Gin)
**Status:** Core handlers, models, migrations written. **Still on old LMS model** (courses, batches, enrollments).
- [ ] **Major:** Refactor from LMS (courses/batches/enrollments) to **Services Portal** model per `NewRequirements.txt`
  - New tables needed: `services`, `projects`, `milestones` (instead of courses/batches/enrollments)
  - New handlers: service management, project brief, milestone tracking, developer assignment
  - New pricing model: RWF + USDT + project-based quotes
  - Payment flow: milestone-based with 2-hour deadline
- [ ] Add Dockerfile for backend
- [ ] Add bulk CSV import/export for clients
- [ ] Add revenue reports, project trends, CSV/PDF export
- [ ] Add client activity log & high-value prospect flagging

### Kcoders Portal — Frontend (Next.js/React)
**Status:** Basic pages scaffolded (login, register, courses, enroll, dashboard, admin, tickets). Auth context + API client exist.
- [ ] Refactor pages from LMS to Services Portal UI
  - Replace course catalog → service catalog with tiered pricing
  - Replace enrollment → project brief submission
  - Replace dashboard → milestone tracking dashboard
  - Update admin panel for new service/project management
- [ ] Build service package selection UI (Basic/Standard/Enterprise)
- [ ] Build project brief form (name, email, WhatsApp, description, budget)
- [ ] Build milestone tracking view
- [ ] Build payment integration (Mobile Money +250788620201)
- [ ] Add password strength meter
- [ ] Add profile completion progress
- [ ] Add "Remember this device" (30-day trusted OTP)
- [ ] Add Dockerfile for frontend

### Infrastructure & DevOps
- [ ] Set up Dockerfiles for both backend and frontend (docker-compose.yml exists but references Dockerfiles that may not exist yet)
- [ ] Set up VPS (Ubuntu 22.04+) deployment
- [ ] Configure CI/CD pipeline
- [ ] Set up PostgreSQL on VPS or use managed DB
- [ ] Configure SMTP for production emails
- [ ] Domain & SSL configuration
- [ ] Migration plan: local filesystem → cloud storage

### AI Lead Capture & Outreach
- [ ] Smart prospect discovery (LinkedIn, GitHub, Twitter, Upwork, AngelList)
- [ ] AI engagement funnel
- [ ] Automated follow-up pipeline (email, WhatsApp)
- [ ] Analytics & success metrics tracking

---

## 🔧 Dev Environment Notes
- **Backend runs on:** Port 8080 (or custom via `PORT` env var)
- **Frontend runs on:** Port 3003 (via `-p 3003` flag)
- **Database:** PostgreSQL via docker-compose (port 5432)
- **SMTP:** Needs real credentials for email features
- **JWT_SECRET:** Change for production
- **Current .env values:** docker-compose defaults — safe for local dev
