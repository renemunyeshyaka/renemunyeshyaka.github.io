-- Kcoders Portal — Initial Schema
-- This migration creates all tables matching the GORM models.
-- Applied automatically by the backend via AutoMigrate, but stored here
-- for reference and for manual database setup without the Go binary.

BEGIN;

-- ==================== Users ====================
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(150)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    phone           VARCHAR(30),
    whatsapp        VARCHAR(30),
    document_path   VARCHAR(500),
    totp_secret     VARCHAR(100),
    is_active       BOOLEAN         NOT NULL DEFAULT FALSE,
    is_admin        BOOLEAN         NOT NULL DEFAULT FALSE,
    email_activated BOOLEAN         NOT NULL DEFAULT FALSE,
    activation_token VARCHAR(500),
    country         VARCHAR(100)    NOT NULL DEFAULT 'RW',
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users (deleted_at);

-- ==================== Services ====================
CREATE TABLE IF NOT EXISTS services (
    id              BIGSERIAL       PRIMARY KEY,
    title           VARCHAR(200)    NOT NULL,
    slug            VARCHAR(200)    NOT NULL,
    description     TEXT,
    image_path      VARCHAR(500),
    category        VARCHAR(50)     NOT NULL DEFAULT 'web',
    is_archived     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_services_slug ON services (slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_services_deleted_at ON services (deleted_at);

-- ==================== Projects ====================
CREATE TABLE IF NOT EXISTS projects (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    service_id      BIGINT          NOT NULL,
    tier            VARCHAR(20)     NOT NULL DEFAULT 'basic',
    status          VARCHAR(20)     NOT NULL DEFAULT 'brief',
    full_name       VARCHAR(150),
    email           VARCHAR(255),
    phone           VARCHAR(30),
    description     TEXT,
    budget_range    VARCHAR(50),
    developer_id    BIGINT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_service_id ON projects (service_id);
CREATE INDEX IF NOT EXISTS idx_projects_developer_id ON projects (developer_id);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects (deleted_at);

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_service
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE;

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_developer
    FOREIGN KEY (developer_id) REFERENCES users(id) ON DELETE SET NULL;

-- ==================== Milestones ====================
CREATE TABLE IF NOT EXISTS milestones (
    id              BIGSERIAL       PRIMARY KEY,
    project_id      BIGINT          NOT NULL,
    title           VARCHAR(200)    NOT NULL,
    description     TEXT,
    amount          DECIMAL(12,2)   NOT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'RWF',
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending',
    deadline        TIMESTAMPTZ,
    paid_at         TIMESTAMPTZ,
    verified_by     BIGINT,
    verified_at     TIMESTAMPTZ,
    reject_reason   TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones (project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_verified_by ON milestones (verified_by);
CREATE INDEX IF NOT EXISTS idx_milestones_deleted_at ON milestones (deleted_at);

ALTER TABLE milestones
    ADD CONSTRAINT fk_milestones_project
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE milestones
    ADD CONSTRAINT fk_milestones_verifier
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL;

-- ==================== OTPs ====================
CREATE TABLE IF NOT EXISTS otps (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    code            VARCHAR(10)     NOT NULL,
    purpose         VARCHAR(20)     NOT NULL DEFAULT 'login',
    expires_at      TIMESTAMPTZ     NOT NULL,
    used            BOOLEAN         NOT NULL DEFAULT FALSE,
    device_token    VARCHAR(200),
    device_expires  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otps_user_id ON otps (user_id);

ALTER TABLE otps
    ADD CONSTRAINT fk_otps_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ==================== Tickets ====================
CREATE TABLE IF NOT EXISTS tickets (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    project_id      BIGINT,
    subject         VARCHAR(300)    NOT NULL,
    message         TEXT            NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'open',
    admin_id        BIGINT,
    reply           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets (user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_project_id ON tickets (project_id);
CREATE INDEX IF NOT EXISTS idx_tickets_admin_id ON tickets (admin_id);
CREATE INDEX IF NOT EXISTS idx_tickets_deleted_at ON tickets (deleted_at);

ALTER TABLE tickets
    ADD CONSTRAINT fk_tickets_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE tickets
    ADD CONSTRAINT fk_tickets_project
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE tickets
    ADD CONSTRAINT fk_tickets_admin
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL;

-- ==================== Visits ====================
CREATE TABLE IF NOT EXISTS visits (
    id              BIGSERIAL       PRIMARY KEY,
    ip              VARCHAR(45),
    page            VARCHAR(500),
    user_agent      VARCHAR(500),
    visited_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits (visited_at);

-- ==================== Activity Logs ====================
CREATE TABLE IF NOT EXISTS activity_logs (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    action          VARCHAR(100)    NOT NULL,
    details         TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs (user_id);

ALTER TABLE activity_logs
    ADD CONSTRAINT fk_activity_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

COMMIT;
