-- Juuksurisalongi broneerimissüsteem - algandmed
-- Parool "admin123" bcrypt hash: $2y$12$LJ3m4ys3Yz5.yG5qO5KYxOqSKJ5RHmKx8v8YKf9X1V8kQ1eXtqJKu

-- Admin kasutaja
INSERT INTO admin_users (id, name, email, password_hash, role) VALUES
('admin-001', 'Admin', 'admin@juuksur.ee', '$2y$12$Sbr3rCZ7kcWdWgdtLu6gWeyI/5.IYVsQ.1wSetxsq/YqJc9Pox4H2', 'SUPER_ADMIN');

-- Salongi seaded
INSERT INTO salon_settings (id, salon_name, salon_name_et, address, phone, email, time_slot_interval, booking_lead_time, max_advance_days) VALUES
('default', 'Hair Salon', 'Juuksurisalong', 'Tallinn, Eesti', '+372 5555 5555', 'info@juuksur.ee', 15, 60, 30);

-- Juuksurid
INSERT INTO barbers (id, name, email, phone, bio, bio_et, is_active, sort_order) VALUES
('barber-001', 'Mari Tamm', 'mari@juuksur.ee', '+372 5111 1111', 'Experienced hair stylist with 10 years of experience.', 'Kogenud juuksur 10-aastase kogemusega.', TRUE, 1),
('barber-002', 'Kati Kask', 'kati@juuksur.ee', '+372 5222 2222', 'Specialist in coloring and modern haircuts.', 'Spetsialiseerunud värvimisele ja moodsatele soengutele.', TRUE, 2),
('barber-003', 'Jaan Mets', 'jaan@juuksur.ee', '+372 5333 3333', 'Barber specializing in men''s cuts and beard grooming.', 'Meeste lõikuste ja habemehoolduse spetsialist.', TRUE, 3);

-- Teenused
INSERT INTO services (id, name, name_et, description, description_et, category, category_et, sort_order) VALUES
('service-001', 'Haircut', 'Juukselõikus', 'Classic haircut with wash and styling', 'Klassikaline juukselõikus pesemise ja viimistlusega', 'Haircut', 'Lõikus', 1),
('service-002', 'Hair Coloring', 'Juuste värvimine', 'Full hair coloring with premium products', 'Juuste täisvärvimine kvaliteettoodetega', 'Coloring', 'Värvimine', 2),
('service-003', 'Beard Trim', 'Habeme trimmerdamine', 'Professional beard shaping and trimming', 'Professionaalne habeme kujundamine ja trimmerdamine', 'Beard', 'Habe', 3),
('service-004', 'Blow Dry & Styling', 'Föönamine ja soeng', 'Wash, blow dry and styling', 'Pesemine, föönamine ja soengu tegemine', 'Styling', 'Soeng', 4),
('service-005', 'Highlights', 'Kiharad / Highlights', 'Partial or full highlights', 'Osaline või täis kiharad', 'Coloring', 'Värvimine', 5);

-- Juuksuri-teenuse seosed (hind ja kestus)
INSERT INTO barber_services (id, barber_id, service_id, price, duration) VALUES
('bs-001', 'barber-001', 'service-001', 25.00, 30),
('bs-002', 'barber-001', 'service-002', 60.00, 90),
('bs-003', 'barber-001', 'service-004', 20.00, 30),
('bs-004', 'barber-001', 'service-005', 80.00, 120),
('bs-005', 'barber-002', 'service-001', 30.00, 30),
('bs-006', 'barber-002', 'service-002', 65.00, 90),
('bs-007', 'barber-002', 'service-004', 25.00, 30),
('bs-008', 'barber-002', 'service-005', 85.00, 120),
('bs-009', 'barber-003', 'service-001', 20.00, 25),
('bs-010', 'barber-003', 'service-003', 15.00, 20);

-- Töögraafikud (E-R 09:00-18:00, L 10:00-16:00, P vaba)
INSERT INTO work_schedules (id, barber_id, day_of_week, start_time, end_time, is_working) VALUES
-- Mari Tamm
('ws-001', 'barber-001', 1, '09:00', '18:00', TRUE),
('ws-002', 'barber-001', 2, '09:00', '18:00', TRUE),
('ws-003', 'barber-001', 3, '09:00', '18:00', TRUE),
('ws-004', 'barber-001', 4, '09:00', '18:00', TRUE),
('ws-005', 'barber-001', 5, '09:00', '18:00', TRUE),
('ws-006', 'barber-001', 6, '10:00', '16:00', TRUE),
('ws-007', 'barber-001', 0, '00:00', '00:00', FALSE),
-- Kati Kask
('ws-008', 'barber-002', 1, '09:00', '18:00', TRUE),
('ws-009', 'barber-002', 2, '09:00', '18:00', TRUE),
('ws-010', 'barber-002', 3, '09:00', '18:00', TRUE),
('ws-011', 'barber-002', 4, '09:00', '18:00', TRUE),
('ws-012', 'barber-002', 5, '09:00', '18:00', TRUE),
('ws-013', 'barber-002', 6, '10:00', '16:00', TRUE),
('ws-014', 'barber-002', 0, '00:00', '00:00', FALSE),
-- Jaan Mets
('ws-015', 'barber-003', 1, '09:00', '18:00', TRUE),
('ws-016', 'barber-003', 2, '09:00', '18:00', TRUE),
('ws-017', 'barber-003', 3, '09:00', '18:00', TRUE),
('ws-018', 'barber-003', 4, '09:00', '18:00', TRUE),
('ws-019', 'barber-003', 5, '09:00', '18:00', TRUE),
('ws-020', 'barber-003', 6, '10:00', '16:00', TRUE),
('ws-021', 'barber-003', 0, '00:00', '00:00', FALSE);

-- Lõunapausid (E-R 12:00-13:00)
INSERT INTO schedule_breaks (id, barber_id, day_of_week, start_time, end_time, label) VALUES
-- Mari Tamm
('sb-001', 'barber-001', 1, '12:00', '13:00', 'Lõuna'),
('sb-002', 'barber-001', 2, '12:00', '13:00', 'Lõuna'),
('sb-003', 'barber-001', 3, '12:00', '13:00', 'Lõuna'),
('sb-004', 'barber-001', 4, '12:00', '13:00', 'Lõuna'),
('sb-005', 'barber-001', 5, '12:00', '13:00', 'Lõuna'),
-- Kati Kask
('sb-006', 'barber-002', 1, '12:00', '13:00', 'Lõuna'),
('sb-007', 'barber-002', 2, '12:00', '13:00', 'Lõuna'),
('sb-008', 'barber-002', 3, '12:00', '13:00', 'Lõuna'),
('sb-009', 'barber-002', 4, '12:00', '13:00', 'Lõuna'),
('sb-010', 'barber-002', 5, '12:00', '13:00', 'Lõuna'),
-- Jaan Mets
('sb-011', 'barber-003', 1, '12:00', '13:00', 'Lõuna'),
('sb-012', 'barber-003', 2, '12:00', '13:00', 'Lõuna'),
('sb-013', 'barber-003', 3, '12:00', '13:00', 'Lõuna'),
('sb-014', 'barber-003', 4, '12:00', '13:00', 'Lõuna'),
('sb-015', 'barber-003', 5, '12:00', '13:00', 'Lõuna');
