-- Sample Data for Testing
-- Run this AFTER running schema.sql
-- This will populate the database with test data

-- Insert sample cohorts
INSERT INTO cohorts (name, start_date, end_date, status, sessions, level, seats_total)
VALUES 
  ('Cohort 1 - Beginner', '2025-02-01', '2025-05-01', 'Upcoming', 12, 'Beginner', 30),
  ('Cohort 2 - Intermediate', '2025-03-15', '2025-06-15', 'Upcoming', 16, 'Intermediate', 25),
  ('Cohort 3 - Advanced', '2025-04-01', '2025-07-01', 'Upcoming', 20, 'Advanced', 20)
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (name, type, start_time, end_time, description, link)
VALUES 
  ('Introduction to Bitcoin', 'live-class', '2025-02-01 10:00:00+00', '2025-02-01 12:00:00+00', 'First class introducing Bitcoin fundamentals', 'https://meet.example.com/intro'),
  ('UTXO Deep Dive', 'workshop', '2025-02-08 14:00:00+00', '2025-02-08 16:00:00+00', 'Understanding UTXOs in detail', 'https://meet.example.com/utxo'),
  ('Assignment 1 Deadline', 'deadline', '2025-02-15 23:59:59+00', '2025-02-15 23:59:59+00', 'Submit your first assignment', NULL),
  ('Bitcoin Security Best Practices', 'live-class', '2025-02-22 10:00:00+00', '2025-02-22 12:00:00+00', 'Learn how to secure your Bitcoin', 'https://meet.example.com/security'),
  ('Community Office Hours', 'community', '2025-02-25 18:00:00+00', '2025-02-25 19:00:00+00', 'Open Q&A session', 'https://meet.example.com/office-hours')
ON CONFLICT DO NOTHING;

-- Note: Profiles, students, and other data will be created through the application
-- You can test by signing up through the UI

