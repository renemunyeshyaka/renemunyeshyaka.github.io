-- Kcoders Portal Database Schema (Services Portal)
-- Run: psql -U kcoders -d kcoders_portal -f 001_init.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    whatsapp VARCHAR(30),
    document_path VARCHAR(500),
    totp_secret VARCHAR(100),
    is_active BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    email_activated BOOLEAN DEFAULT false,
    activation_token VARCHAR(500),
    country VARCHAR(100) DEFAULT 'RW',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Services table (replaces courses)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    image_path VARCHAR(500),
    category VARCHAR(50) NOT NULL DEFAULT 'web',
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Projects table (replaces enrollments)
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    service_id INTEGER NOT NULL REFERENCES services(id),
    tier VARCHAR(20) DEFAULT 'basic',
    status VARCHAR(20) DEFAULT 'brief' CHECK (status IN ('brief','proposal','active','completed','cancelled')),
    full_name VARCHAR(150),
    email VARCHAR(255),
    phone VARCHAR(30),
    description TEXT,
    budget_range VARCHAR(50),
    developer_id INTEGER REFERENCES users(id),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Milestones table (replaces payments)
CREATE TABLE IF NOT EXISTS milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'RWF',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','confirmed','completed')),
    deadline TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    reject_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- OTP table
CREATE TABLE IF NOT EXISTS otps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    code VARCHAR(10) NOT NULL,
    purpose VARCHAR(20) DEFAULT 'login',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    device_token VARCHAR(200),
    device_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    subject VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','replied','closed')),
    admin_id INTEGER REFERENCES users(id),
    reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Visits table
CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    ip VARCHAR(45),
    page VARCHAR(500),
    user_agent VARCHAR(500),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_service_id ON projects(service_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_otps_user_id ON otps(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_project_id ON tickets(project_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- Seed data: Default admin user (password: admin123)
-- Change this after first login!
INSERT INTO users (name, email, password_hash, is_admin, is_active, email_activated)
VALUES ('Admin', 'admin@kcoders.org', '$2a$10$dummyhash', true, true, true)
ON CONFLICT (email) DO NOTHING;

-- Seed data: Default services
INSERT INTO services (title, slug, description, category) VALUES
('Custom Web Development', 'custom-web-development', 'Full-stack web applications built with modern frameworks (React, Next.js, Spring Boot, Go). From landing pages to complex enterprise platforms.', 'web'),
('Mobile App Development', 'mobile-app-development', 'Cross-platform mobile applications using React Native. Available for iOS and Android with native-like performance.', 'mobile'),
('API Development & Integration', 'api-development-integration', 'RESTful API design, third-party integrations, microservices architecture, and system interoperability solutions.', 'api'),
('DevOps & Cloud Infrastructure', 'devops-cloud-infrastructure', 'CI/CD pipeline setup, Docker/Kubernetes containerization, AWS/Azure cloud architecture, and infrastructure automation.', 'devops'),
('Cybersecurity Consulting', 'cybersecurity-consulting', 'Security audits, penetration testing, vulnerability assessments, secure architecture design, and compliance consulting.', 'security'),
('Code Auditing & QA', 'code-auditing-qa', 'Comprehensive code review, technical debt analysis, automated testing implementation, and quality assurance processes.', 'audit'),
('Technical Architecture Design', 'technical-architecture-design', 'System design, database modeling, scalability planning, and technology stack recommendations for new or existing projects.', 'architecture')
ON CONFLICT (slug) DO NOTHING;
