-- =========  SAFETY FIRST  ===============================================
--   Each CREATE uses IF NOT EXISTS, so running the script again is safe.
-- ========================================================================

-- 1️⃣  Helpers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2️⃣  USERS
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY    DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('recruiter','faculty')),
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3️⃣  FACULTY  (relies on users.id)
CREATE TABLE IF NOT EXISTS faculty (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department              TEXT NOT NULL,
  expertise_areas         TEXT[]    DEFAULT '{}',
  research_interests      TEXT[]    DEFAULT '{}',
  qualifications          TEXT,
  interview_types         TEXT[]    DEFAULT '{technical}',
  max_interviews_per_week INT       DEFAULT 5,
  is_available            BOOLEAN   DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faculty_user_id ON faculty(user_id);

-- (You can keep other tables below -- interviews, candidates, etc.)
