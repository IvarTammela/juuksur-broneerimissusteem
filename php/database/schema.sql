-- Juuksurisalongi broneerimissüsteem - andmebaasi skeem
-- PostgreSQL 17

-- Enum tüübid
CREATE TYPE user_role AS ENUM ('ADMIN', 'SUPER_ADMIN');
CREATE TYPE appointment_status AS ENUM ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- Kasutajad (admin autentimine)
CREATE TABLE admin_users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Juuksurid
CREATE TABLE barbers (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    bio TEXT,
    bio_et TEXT,
    image_url VARCHAR(500),
    password_hash VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_barbers_active ON barbers(is_active);

-- Teenused
CREATE TABLE services (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    name_et VARCHAR(255) NOT NULL,
    description TEXT,
    description_et TEXT,
    category VARCHAR(100),
    category_et VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_active ON services(is_active);

-- Juuksuri-teenuse seos (hind ja kestus juuksuri kohta)
CREATE TABLE barber_services (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    barber_id VARCHAR(36) NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    service_id VARCHAR(36) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL, -- minutites
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(barber_id, service_id)
);

CREATE INDEX idx_barber_services_barber ON barber_services(barber_id);
CREATE INDEX idx_barber_services_service ON barber_services(service_id);

-- Töögraafik (nädalapõhine korduv)
CREATE TABLE work_schedules (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    barber_id VARCHAR(36) NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time VARCHAR(5) NOT NULL,
    end_time VARCHAR(5) NOT NULL,
    is_working BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(barber_id, day_of_week)
);

CREATE INDEX idx_work_schedules_barber ON work_schedules(barber_id);

-- Graafikupausid (lõuna jne)
CREATE TABLE schedule_breaks (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    barber_id VARCHAR(36) NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time VARCHAR(5) NOT NULL,
    end_time VARCHAR(5) NOT NULL,
    label VARCHAR(100)
);

CREATE INDEX idx_schedule_breaks_barber_day ON schedule_breaks(barber_id, day_of_week);

-- Broneeringud
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    barber_id VARCHAR(36) NOT NULL REFERENCES barbers(id),
    service_id VARCHAR(36) NOT NULL REFERENCES services(id),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    start_time VARCHAR(5) NOT NULL,
    end_time VARCHAR(5) NOT NULL,
    status appointment_status NOT NULL DEFAULT 'CONFIRMED',
    notes TEXT,
    admin_notes TEXT,
    total_price DECIMAL(10, 2) NOT NULL,
    locale VARCHAR(5) NOT NULL DEFAULT 'et',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_barber_date ON appointments(barber_id, date);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_phone ON appointments(client_phone);

-- Salongi seaded (üks rida)
CREATE TABLE salon_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT 'default',
    salon_name VARCHAR(255) NOT NULL DEFAULT 'Juuksurisalong',
    salon_name_et VARCHAR(255) NOT NULL DEFAULT 'Juuksurisalong',
    address VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(255),
    time_slot_interval INTEGER NOT NULL DEFAULT 15,
    booking_lead_time INTEGER NOT NULL DEFAULT 60,
    max_advance_days INTEGER NOT NULL DEFAULT 30,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
