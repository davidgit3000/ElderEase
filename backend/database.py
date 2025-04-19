import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os
from contextlib import contextmanager

load_dotenv()

# Get database connection details from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")  # Neon DB connection string

def get_db_connection():
    """Create a new database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise

@contextmanager
def get_db_cursor():
    """Context manager for database operations"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        yield cursor
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

# ───────────────────────────────────────────────────────────────
# Initialize database tables  – revised schema (no role column)
# ───────────────────────────────────────────────────────────────
def init_db():
    """
    Rebuilds the DB with:
        users, medications, schedules, appointments, reminders, caregivers, clinics, clinic_patient_map
    """
    with get_db_cursor() as cursor:
        # 1️⃣  Drop in FK‑safe order
        cursor.execute("DROP TABLE IF EXISTS clinic_patient_map")
        cursor.execute("DROP TABLE IF EXISTS caregivers")
        cursor.execute("DROP TABLE IF EXISTS clinics")
        cursor.execute("DROP TABLE IF EXISTS reminders")
        cursor.execute("DROP TABLE IF EXISTS appointments")
        cursor.execute("DROP TABLE IF EXISTS schedules")
        cursor.execute("DROP TABLE IF EXISTS medications")
        cursor.execute("DROP TABLE IF EXISTS users")

        # 2️⃣  Extension for gen_random_uuid()
        cursor.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")

        # 3️⃣  Core tables
        # ── users ───────────────────────────────────────────────
        cursor.execute("""
            CREATE TABLE users (
                user_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email         TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name     TEXT,
                phone_number  TEXT NOT NULL
                               CHECK (phone_number ~ '^\\+\\d{10,15}$'),
                date_of_birth DATE,                             --  ← new field
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        # ── medications ────────────────────────────────────────
        cursor.execute("""
            CREATE TABLE medications (
                medication_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id       UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                name          TEXT NOT NULL,
                dosage        TEXT NOT NULL,
                notes         TEXT,
                created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        # ── schedules ──────────────────────────────────────────
        cursor.execute("""
            CREATE TABLE schedules (
                schedule_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                medication_id UUID NOT NULL REFERENCES medications(medication_id) ON DELETE CASCADE,
                recurrence    TEXT NOT NULL,
                time_of_day   TIME NOT NULL,
                start_date    DATE NOT NULL DEFAULT CURRENT_DATE,
                end_date      DATE,
                created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        # ── appointments ───────────────────────────────────────
        cursor.execute("""
            CREATE TABLE appointments (
                appointment_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                title           TEXT NOT NULL,
                location        TEXT,
                scheduled_for   TIMESTAMPTZ NOT NULL,
                reminder_offset INTERVAL,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        # ── reminders (polymorphic) ────────────────────────────
        cursor.execute("""
            CREATE TABLE reminders (
                reminder_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                schedule_id     UUID REFERENCES schedules(schedule_id)     ON DELETE CASCADE,
                appointment_id  UUID REFERENCES appointments(appointment_id) ON DELETE CASCADE,
                remind_at       TIMESTAMPTZ NOT NULL,
                acknowledged_at TIMESTAMPTZ,
                status          TEXT NOT NULL
                               CHECK (status IN ('pending','sent','acknowledged','missed')),
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CHECK (
                  (schedule_id IS NOT NULL AND appointment_id IS NULL) OR
                  (schedule_id IS NULL AND appointment_id IS NOT NULL)
                )
            );
        """)

        # 4️⃣  New access‑control tables
        # ── caregivers ─────────────────────────────────────────
        cursor.execute("""
            CREATE TABLE caregivers (
                caregiver_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                caregiver_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                elder_user_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                relationship      TEXT,                      -- 'daughter', 'nurse', etc.
                created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        # ── clinics (profile) ──────────────────────────────────
        cursor.execute("""
            CREATE TABLE clinics (
                clinic_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                name        TEXT NOT NULL,
                address     TEXT,
                phone       TEXT,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        # ── clinic ↔ elder mapping (edit permission) ───────────
        cursor.execute("""
            CREATE TABLE clinic_patient_map (
                clinic_id      UUID REFERENCES clinics(clinic_id) ON DELETE CASCADE,
                elder_user_id  UUID REFERENCES users(user_id)    ON DELETE CASCADE,
                can_edit       BOOLEAN NOT NULL DEFAULT TRUE,
                PRIMARY KEY (clinic_id, elder_user_id)
            );
        """)

        # 5️⃣  Helpful indexes
        cursor.execute("CREATE INDEX schedules_med_idx         ON schedules(medication_id)")
        cursor.execute("CREATE INDEX appointments_user_idx     ON appointments(user_id, scheduled_for)")
        cursor.execute("CREATE INDEX reminders_schedule_idx    ON reminders(schedule_id, remind_at)")
        cursor.execute("CREATE INDEX reminders_appointment_idx ON reminders(appointment_id, remind_at)")
        cursor.execute("CREATE INDEX caregivers_elder_idx      ON caregivers(elder_user_id)")
        cursor.execute("CREATE INDEX clinic_map_elder_idx      ON clinic_patient_map(elder_user_id)")

        # 6️⃣  updated_at trigger
        cursor.execute("""
            CREATE OR REPLACE FUNCTION set_updated_at()
            RETURNS trigger AS $$
            BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """)
        for table in ("users", "medications", "schedules", "appointments",
                      "reminders", "clinics", "caregivers"):
            cursor.execute(f"""
                CREATE TRIGGER trg_{table}_set_updated
                BEFORE UPDATE ON {table}
                FOR EACH ROW EXECUTE FUNCTION set_updated_at();
            """)


# Call init_db() when running this file directly
if __name__ == "__main__":
    init_db()
    print("Database tables created successfully")