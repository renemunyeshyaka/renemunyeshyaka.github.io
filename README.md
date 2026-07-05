# Kcoders.org — Portfolio & Client Portal

---

## 📌 Project Overview

This project is a **dual-platform** system:

1. **Portfolio** — A modern, interactive static portfolio for **Jean René MUNYESHYAKA** showcasing products (LandVal, CV Builder, Kcoders Portal), projects (GitHub repos), professional services, and technical skills.
2. **Client Portal** — A secure platform for managing software development projects with client onboarding, project tracking, service agreements, invoicing, ticket support, and payment via Mobile Money.

The portfolio has been **completely redesigned** from the original static HTML into a visually stunning, interactive experience with clear **Products vs Projects** distinction, AI-powered lead capture, and enhanced UX.

---

## 🏗️ System Architecture

| Layer | Technology |
|-------|------------|
| **Portfolio** | Static HTML5, CSS3 (custom properties + animations), ES6+ JavaScript |
| **Backend (Portal)** | Go (Gin framework) |
| **Frontend (Portal)** | React with TypeScript, Vite (Build tool), React Router (Routing), Axios (HTTP client) |
| **Database** | PostgreSQL 15+ |
| **Authentication** | Email activation + TOTP (time-based OTP) |
| **File Storage** | Local filesystem (migrated to VPS later) |
| **Emails** | SMTP (Gmail) |
| **AI Chat** | Portfolio AI Assistant — Intelligent visitor engagement & lead capture |
| **Deployment** | GitHub Pages (portfolio) + VPS Ubuntu 22.04+ (Portal) |

---

## ✨ Portfolio Features

### Design & UX
- ✅ Dark-first design with smooth light/dark toggle
- ✅ Full-screen animated hero with particle background & typewriter effect
- ✅ 3D card tilt effects on services & products
- ✅ Scroll-triggered animations (Intersection Observer)
- ✅ Mobile-first responsive layout
- ✅ Smooth theme transitions

### Sections
| Section | Description |
|---------|-------------|
| **Hero** | Animated full-screen intro with role rotator & CTA buttons |
| **About** | Bio, stats counters, experience timeline, resume download |
| **Services** | 3D flip cards with hover effects (Web Dev, Mobile, DevOps, Cloud, Cybersecurity, Consulting) |
| **Technologies** | Animated skill bars + icon grid with proficiency indicators |
| **Products (NEW)** | Dedicated section for live SaaS products with mockups & live links |
| **Projects** | GitHub repo showcase with category filters (All, Full Stack, Frontend, Backend, AI/Security) |
| **Testimonials (NEW)** | Client/partner testimonials carousel |
| **Contact** | Animated form with social proof, WhatsApp direct link, reCAPTCHA v2 |
| **Footer** | Multi-column footer with newsletter signup, quick links, social icons |

### Products (Live SaaS)
| Product | URL | Description |
|---------|-----|-------------|
| **LandVal** | https://landval.kcoders.org/ | AI-powered land valuation for Rwanda using govt gazette data & market analysis |
| **CV Builder** | https://cvbuilder.kcoders.org/ | Professional CV builder with digital signatures, QR codes, multi-format export |
| **Kcoders Portal** | https://kcoders.org/ | Client portal for software dev services with project management, milestone tracking, TOTP auth & support ticketing |

### Projects (GitHub)
Updated with repos from https://github.com/renemunyeshyaka/ including:
- Pay Gateway System, Automated Evaluation, Scan & Pay, eLearnPro, Swedish Open University
- Net Attack Simulator, Face Recognition Attendance, QR Code Generator, Cybersecurity Aptitude Test
- RSSB Project, Store Management System, Nicolas in Dubai, MNDA Rwanda

---

## ✨ Client Portal Core Features

### Client Features
- ✅ Register/Login with email activation link
- ✅ Multi-factor authentication (TOTP on every login)
- ✅ Client dashboard with project overview & progress tracking
- ✅ Browse & request software development services
- ✅ Select service packages (Web App, Mobile App, API, DevOps, Security Audit)
- ✅ Fill project brief (name, email, WhatsApp, project description, budget range)
- ✅ Receive email with proposal & service agreement
- ✅ Milestone-based payment via Mobile Money: **+250788620201**
- ✅ Service delivery tracking with milestone checkpoints
- ✅ "Remember this device" option for OTP (30-day trusted device)
- ✅ Password strength meter & profile completion progress

### Admin Features
- ✅ Dual dashboard (Client view + Admin view)
- ✅ Client management (view, edit, delete, activate/suspend, bulk CSV import/export)
- ✅ Service management (add, edit, archive, package tiers: Basic, Standard, Enterprise)
- ✅ Project allotment (assign developers, set milestones, sprint planning)
- ✅ Pricing management (RWF for Rwanda, USDT for international, project-based quotes)
- ✅ Payment verification (confirm/reject milestone payments with timeline)
- ✅ Document & deliverable review (uploaded specs, designs, source code)
- ✅ Visit counter from a specific date/time
- ✅ Revenue reports, project trends, export CSV/PDF
- ✅ Client activity log, flag high-value prospects

---

## 📂 Project Structure

```
/
├── README.md                       # Project documentation
├── redesign.md                     # Redesign plan & AI targeting
├── NewRequirements.txt             # Requirements document
│
└── kcoders-portal/                 # Main project directory
    ├── portfolio/                  # Static portfolio (HTML/CSS/JS)
    │   ├── index.html              # Redesigned portfolio homepage
    │   ├── css/
    │   │   ├── style.css           # Complete design system
    │   │   └── animations.css      # Enhanced animations
    │   ├── js/
    │   │   ├── main.js             # Interactive features
    │   │   └── projects.js         # Updated project data
    │   ├── images/                 # Portfolio images & icons
    │   ├── assets/projects/        # Project screenshots
    │   ├── redesign.md             # Portfolio redesign plan
    │   └── NewRequirements.txt
    │
    ├── backend/                    # Go (Gin framework) API
    │   ├── cmd/server/main.go
    │   ├── internal/
    │   │   ├── auth/               # JWT, OTP, email activation
    │   │   ├── handlers/           # API handlers (services, projects, clients, payments)
    │   │   ├── models/             # GORM models
    │   │   ├── middleware/         # Auth, rate limiting
    │   │   └── utils/              # Email, file upload
    │   ├── migrations/             # SQL migration files
    │   └── .env
    │
    ├── frontend/                   # React with TypeScript, Next.js
    │   ├── app/
    │   │   ├── (portal)/           # Portal routes (login, register, dashboard, services, admin)
    │   │   ├── layout.tsx
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── portal/             # Portal-specific components
    │   │   └── shared/             # Shared components (PortalLayout, Navbar, ProtectedRoute)
    │   ├── lib/                    # API client, auth context
    │   └── .env.local
    │
    ├── storage/                    # Uploads & backups
    │   ├── uploads/
    │   └── backups/
    ├── scripts/                    # Backup & migration scripts
    ├── docker-compose.yml
    └── .gitignore
```

---

## 🤖 AI Lead Generation & Outreach

### Strategy Overview
An intelligent lead generation system to identify opportunities, attract collaborations, and convert portfolio visitors into clients for software development, consulting, and technical services.

### Phase 1: Smart Prospect Discovery
| Channel | Method | Purpose |
|---------|--------|---------|
| **LinkedIn** | Connect with tech leads, HR managers, startup founders in East Africa | Freelance & collaboration opportunities |
| **GitHub** | Engage with developers using Spring Boot, React, Go, Python | Open-source collab & job leads |
| **Twitter/X** | Monitor keywords: "software developer Rwanda", "full stack project", "cybersecurity freelance" | Project opportunities |
| **Upwork / Fiverr** | Profile optimization & automated bid suggestions | Freelance gigs |
| **AngelList / Wellfound** | Discover startups hiring in East Africa | Full-time & contract roles |

### Phase 2: AI Engagement Funnel
1. **Discovery** → AI scans channels → scores leads by relevance (high/medium/low)
2. **Outreach** → Personalized messages generated by AI per lead segment
3. **Nurture** → Chat widget on portfolio → captures visitor intent → routes to relevant service/skill
4. **Convert** → Auto-schedule discovery calls → share portfolio highlights → send proposals

### Phase 3: Portfolio Chat Widget
- Embedded on portfolio as floating chat bubble
- Greets visitors with: *"Hi! 👋 I'm your AI assistant. How can I help you today?"*
- Understands natural language queries about skills, services, and projects
- Captures lead info (name, email, phone) and stores for follow-up
- Routes high-intent leads to email notification for prompt response

### Success Metrics
- **Lead capture rate:** >15% of unique visitors
- **Response time:** <5 seconds for chat queries
- **Conversion rate:** >5% from chat lead to project/client
- **Outreach efficiency:** Reduced by 40% versus manual outreach

---

## 🚀 Quick Start (Development)

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 15+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/renemunyeshyaka/kcoders-portal.git
cd kcoders-portal
```

### 2. Database Setup
```bash
sudo -u postgres createdb kcoders_portal
sudo -u postgres psql -c "CREATE USER kcoders WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kcoders_portal TO kcoders;"
```

Run migrations:
```bash
cd backend
go run migrations/migrate.go
```

### 3. Backend (Go)
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials, SMTP settings, etc.

go mod download
go run cmd/server/main.go
# Backend runs on: http://localhost:5003
```

### 4. Frontend (Next.js)
```bash
cd frontend
cp .env.local.example .env.local
# Edit API_URL=http://localhost:5003

npm install
npm run dev
or 
npm run build
npm run start
# Frontend runs on: http://localhost:3003
```

### 5. Access Application
- **Portal site:** http://localhost:3003 (portfolio)
- **Portal Login:** http://localhost:3003/login
- **Admin access:** http://localhost:3003/admin (requires admin credentials)

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=kcoders
DB_PASSWORD=your_password
DB_NAME=kcoders_portal

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRY_HOURS=24

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@kcoders.org

# TOTP
TOTP_ISSUER=Kcoders.org

# File Upload
MAX_UPLOAD_SIZE=5242880  # 5MB
ALLOWED_EXTENSIONS=.pdf,.jpg,.jpeg,.png

# Admin
ADMIN_EMAIL=admin@kcoders.org

# Port
PORT=5003
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5003/api
NEXT_PUBLIC_MOMO_PHONE=+250788620201
```

---

## 📋 Database Schema (Key Tables)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    totp_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    package_tiers JSONB,          -- {basic: {price_rwf, price_usd}, standard: {...}, enterprise: {...}}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table (client projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id),
    service_id UUID REFERENCES services(id),
    package_tier VARCHAR(50),     -- basic, standard, enterprise
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'brief',  -- brief, quoted, in_progress, review, completed, cancelled
    budget_range VARCHAR(100),
    currency VARCHAR(10),
    start_date TIMESTAMP,
    deadline TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Milestones table
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    title VARCHAR(255),
    description TEXT,
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    status VARCHAR(50) DEFAULT 'pending',  -- pending, paid, confirmed
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    payment_deadline TIMESTAMP,  -- 2 hours from payment request
    created_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'open',  -- open, responded, resolved, closed
    priority VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 Workflow: Client Onboarding & Project Delivery

1. **Client registers** → receives activation email → clicks link to activate account
2. **Client logs in** → enters OTP from authenticator app
3. **Browses services** → views development packages (Web App, Mobile App, API, DevOps, Security Audit)
4. **Selects service + package tier** (Basic, Standard, Enterprise) → fills project brief:
   - Full name (pre-filled)
   - Email (pre-filled)
   - WhatsApp phone number
   - Project description & requirements
   - Budget range & timeline
5. **Submits brief** → admin receives notification → reviews requirements
6. **Admin sends proposal** with:
   - Customized solution & timeline
   - Milestone breakdown with amounts
   - Service agreement terms
7. **Client accepts proposal** → project moves to active
8. **Milestone-based payment** via Mobile Money: **+250788620201**
   - Each milestone paid before work begins on that phase
   - 2-hour window to complete each milestone payment
9. **Delivery & review**:
   - ✅ Milestone completed → Client reviews deliverable
   - ❌ Revision requested → Free revisions within scope
   - ✅ All milestones paid & approved → Project closed

---

## 👨‍💼 Admin Guide

### Access Admin Dashboard
1. Login with admin credentials
2. Navigate to `/admin` (link appears in user menu for admins)

### Admin Capabilities

| Section | Actions |
|---------|---------|
| **Client Management** | View all clients, activate/suspend, view project history |
| **Service Management** | Add/edit services, configure package tiers (Basic/Standard/Enterprise pricing in RWF & USDT) |
| **Project Management** | Review briefs, assign developers, set milestones, track progress |
| **Payment Verification** | Confirm milestone payments with 2-hour countdown timer |
| **Deliverable Review** | Upload/download project deliverables, request revisions |
| **Support Tickets** | Respond to client tickets, mark as resolved |
| **Reports** | Revenue reports, project pipeline, client activity logs |

### Client Onboarding Process
1. Admin receives email notification of new project brief
2. Reviews requirements → may ask clarifying questions via dashboard
3. Creates proposal with milestone breakdown and pricing
4. Client accepts → project status changes to "in_progress"
5. Admin assigns developers and sets up sprint milestones
6. Each milestone: work → deliver → client approves → payment confirmed

---

## 🛠️ Deployment (VPS)

### Production Setup

```bash
# 1. Clone and build backend
cd backend
go build -o kcoders-api cmd/server/main.go
sudo systemctl enable kcoders-api.service

# 2. Build frontend
cd frontend
npm run build
npm run start  # Runs on port 3003 with PM2

# 3. Set up Nginx reverse proxy
sudo nano /etc/nginx/sites-available/kcoders
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name kcoders.org www.kcoders.org;
    
    # Existing portfolio (static)
    location / {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
    }
    
    # API routes
    location /api {
        proxy_pass http://localhost:5003;
        proxy_set_header Host $host;
    }
    
    # Uploaded files
    location /uploads {
        alias /var/www/kcoders/storage/uploads;
    }
}
```

### Database Backups (Cron)
```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * /path/to/kcoders-portal/scripts/backup.sh
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
go test ./... -v


```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Manual Test Scenarios
1. **Registration** → Check email for activation link
2. **Login** → Verify OTP required every time
3. **Project brief submission** → Admin receives notification with client & project details
4. **Milestone payment** → 2-hour window countdown, payment confirmation flow
5. **Document upload** → File saved correctly, admin can download and review
6. **2-hour timeout** → Pending milestone payment auto-cancels after 120 minutes
7. **Admin approval** → Client receives email with project start confirmation

---

## 📞 Support & Maintenance

### Contact Information
- **Technical Support:** dev@kcoders.org
- **Payment Issues:** +250788620201 (WhatsApp)
- **Admin Emergency:** admin@kcoders.org

### Monitoring (Recommended)
- **Uptime monitoring:** UptimeRobot or Better Stack (free tier)
- **Error tracking:** Sentry (free for small teams)
- **Logs:** `journalctl -u kcoders-api -f`

### Regular Maintenance Tasks
- [ ] Weekly: Check storage space for uploaded documents
- [ ] Monthly: Review project pipeline and pending quotes
- [ ] Quarterly: Update dependencies (`go mod tidy`, `npm update`)
- [ ] Annually: Rotate JWT secret and TOTP issuer

---

## 🚧 Known Limitations (Phase 1)

- No automated SMS (only email notifications)
- No payment gateway integration (pure manual verification)
- No real-time chat (uses WhatsApp for client communication)
- No mobile app (web-only PWA planned for Phase 2)
- Limited to milestone-based billing (hourly/subscription planned)

---

## 🔮 Future Roadmap

**Phase 2 (3 months)**
- Progressive Web App (offline access)
- Course completion certificates with QR validation
- Bulk email campaigns to enrolled users
- Payment screenshot upload with auto-OCR (experimental)

**Phase 3 (6 months)**
- Mobile app (React Native)
- Live class recording & streaming
- Automated WhatsApp reminders via Twilio API
- Multi-language support (Kinyarwanda, French)

---

## 📄 License

Proprietary – All rights reserved © Kcoders.org

---

## 🙏 Acknowledgments

- Built with Go Gin Framework & Next.js 14
- Icons from Heroicons & Lucide React
- Documentation assistance from Claude (Anthropic)

---

**🚀 Ready to Deploy!**

For questions or support, contact the development team at **dev@kcoders.org**

For questions or support, contact the development team at **dev@kcoders.org**


# How to Start both kcoders-portal/backend/ and kcoders-portal/frontend/

## 1. Start PostgreSQL (Docker)

```bash
cd kcoders-portal

# Start the PostgreSQL database container
docker compose up -d postgres

# Verify it's running
docker ps | grep kcoders-db
```

> The database runs on `localhost:5433` as defined in `docker-compose.yml`.

## 2. Backend (Go/Gin)

```bash
cd kcoders-portal/backend

# Run the server
go run cmd/server/main.go

# Backend runs on http://localhost:5003
```

## 3. Frontend (Next.js)

```bash
cd kcoders-portal/frontend

# Development mode
npm run dev

# OR production mode
npm run build && npm run start

# Frontend runs on http://localhost:3003
```