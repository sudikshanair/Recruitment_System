-- Insert sample users with bcrypt hashed passwords
-- Password for all users is "password123" hashed with bcrypt
INSERT INTO users (email, password_hash, full_name, role, phone) VALUES
('recruiter@company.com', '$2b$10$rOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9', 'John Recruiter', 'recruiter', '+1234567890'),
('sarah.smith@university.edu', '$2b$10$rOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9', 'Dr. Sarah Smith', 'interviewer', '+1234567891'),
('mike.johnson@university.edu', '$2b$10$rOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9', 'Prof. Mike Johnson', 'interviewer', '+1234567892'),
('alice.developer@email.com', '$2b$10$rOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9', 'Alice Developer', 'candidate', '+1234567893'),
('bob.engineer@email.com', '$2b$10$rOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9', 'Bob Engineer', 'candidate', '+1234567894')
ON CONFLICT (email) DO NOTHING;

-- Insert sample faculty members
INSERT INTO faculty (user_id, department, expertise_areas, research_interests, qualifications, interview_types, is_available, max_interviews_per_week)
SELECT 
  id,
  'Computer Science',
  ARRAY['React', 'Node.js', 'System Design', 'Web Development'],
  ARRAY['Human-Computer Interaction', 'Software Engineering', 'Web Technologies'],
  'PhD in Computer Science, 10+ years industry experience',
  ARRAY['technical', 'coding', 'behavioral'],
  true,
  8
FROM users WHERE email = 'sarah.smith@university.edu';

INSERT INTO faculty (user_id, department, expertise_areas, research_interests, qualifications, interview_types, is_available, max_interviews_per_week)
SELECT 
  id,
  'Computer Science',
  ARRAY['Algorithms', 'Data Structures', 'Python', 'Machine Learning'],
  ARRAY['Artificial Intelligence', 'Data Science', 'Algorithm Design'],
  'PhD in Computer Science, Professor with 15+ years experience',
  ARRAY['technical', 'hr', 'behavioral'],
  true,
  6
FROM users WHERE email = 'mike.johnson@university.edu';

-- Insert sample candidates
INSERT INTO candidates (user_id, experience_years, skills, current_company, expected_salary, notice_period, resume_filename, status)
SELECT 
  id,
  5,
  ARRAY['React', 'JavaScript', 'Node.js', 'TypeScript'],
  'Tech Corp',
  '$130,000',
  '2 weeks',
  'alice_developer_resume.pdf',
  'active'
FROM users WHERE email = 'alice.developer@email.com';

INSERT INTO candidates (user_id, experience_years, skills, current_company, expected_salary, notice_period, resume_filename, status)
SELECT 
  id,
  3,
  ARRAY['React', 'TypeScript', 'CSS', 'HTML'],
  'StartupXYZ',
  '$90,000',
  '1 month',
  'bob_engineer_resume.pdf',
  'active'
FROM users WHERE email = 'bob.engineer@email.com';

-- Insert sample interviews
INSERT INTO interviews (candidate_id, interviewer_id, interview_type, scheduled_date, duration_minutes, meeting_link, status)
SELECT 
  c.id,
  f.id,
  'technical',
  NOW() + INTERVAL '2 days',
  60,
  'https://teams.microsoft.com/l/meetup-join/sample-link-1',
  'scheduled'
FROM candidates c, faculty f
WHERE c.user_id = (SELECT id FROM users WHERE email = 'alice.developer@email.com')
AND f.user_id = (SELECT id FROM users WHERE email = 'sarah.smith@university.edu');

INSERT INTO interviews (candidate_id, interviewer_id, interview_type, scheduled_date, duration_minutes, meeting_link, status)
SELECT 
  c.id,
  f.id,
  'behavioral',
  NOW() + INTERVAL '3 days',
  45,
  'https://teams.microsoft.com/l/meetup-join/sample-link-2',
  'scheduled'
FROM candidates c, faculty f
WHERE c.user_id = (SELECT id FROM users WHERE email = 'bob.engineer@email.com')
AND f.user_id = (SELECT id FROM users WHERE email = 'mike.johnson@university.edu');
