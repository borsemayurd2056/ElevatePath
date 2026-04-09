-- Insert Granular Careers into the Supabase database
-- Ensure that you have the required columns: title, description, category, salary_range_min, salary_range_max, demand_level, required_skills

CREATE TABLE IF NOT EXISTS careers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  salary_range_min NUMERIC,
  salary_range_max NUMERIC,
  demand_level TEXT,
  required_skills TEXT[]
);

-- Optional: clear existing test data if you want to run this cleanly
-- TRUNCATE TABLE careers;

-- 1. Defense (NDA)
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'National Defence Academy (NDA) Officer', 
  'Serve the nation as a commissioned officer in the Army, Navy, or Air Force. Requires discipline, physical fitness, and leadership.',
  'defense',
  800000, 2500000, 'high',
  ARRAY['Leadership', 'Physical Fitness', 'Discipline', 'Strategic Thinking']
);

-- 2. Civil Services (UPSC)
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Civil Servant (IAS/IPS)', 
  'Administer government policies, manage law and order, and drive societal development at the highest administrative levels.',
  'civil_services',
  700000, 3000000, 'high',
  ARRAY['Public Administration', 'Decision Making', 'Policy Development', 'Empathy']
);

-- 3. Engineering (Computer Science)
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Computer Science Engineer', 
  'Design, develop, and test software systems and algorithms. Central to the modern IT industry.',
  'engineering',
  600000, 3500000, 'high',
  ARRAY['Programming', 'Data Structures', 'System Design', 'Mathematics']
);

-- 4. Engineering (Mechanical)
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Mechanical Engineer', 
  'Design and build mechanical devices and systems, from automotive parts to complex manufacturing machinery.',
  'engineering',
  400000, 1800000, 'medium',
  ARRAY['Physics', 'AutoCAD', 'Thermodynamics', 'Problem Solving']
);

-- 5. Medical (MBBS)
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Medical Doctor (MBBS)', 
  'Diagnose, treat, and prevent illnesses. A highly respected profession requiring intense dedication and empathy.',
  'medical',
  900000, 4000000, 'high',
  ARRAY['Biology', 'Anatomy', 'Clinical Skills', 'Empathy']
);

-- 6. IT / Software roles
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Full Stack Developer', 
  'Build and maintain both the front-end and back-end of web applications, driving modern digital experiences.',
  'it_software',
  500000, 2800000, 'high',
  ARRAY['JavaScript', 'React', 'Node.js', 'Database Management']
);

INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Data Scientist', 
  'Analyze complex data sets to discover trends and inform strategic business decisions using AI and Machine Learning.',
  'it_software',
  800000, 3500000, 'high',
  ARRAY['Python', 'Machine Learning', 'Statistics', 'Data Visualization']
);

-- 7. Management (BBA/MBA)
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Business Operations Manager', 
  'Oversee daily business operations, optimize processes, and lead teams to maximize efficiency and profit.',
  'management',
  600000, 2500000, 'high',
  ARRAY['Leadership', 'Financial Analysis', 'Communication', 'Strategic Planning']
);

-- 8. Diploma Branches
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Polytechnic Engineer / Technician', 
  'Apply practical technical skills in various engineering domains to build and maintain infrastructure without a 4-year degree.',
  'diploma',
  300000, 900000, 'medium',
  ARRAY['Practical Engineering', 'Tool Handling', 'Project Execution', 'Safety Protocols']
);

-- 9. Skill-based careers
INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'Digital Marketing Strategist', 
  'Design and execute online campaigns to boost brand visibility. Requires creativity and an understanding of analytics.',
  'skill_based',
  400000, 1500000, 'high',
  ARRAY['SEO', 'Content Creation', 'Social Media', 'Data Analytics']
);

INSERT INTO careers (title, description, category, salary_range_min, salary_range_max, demand_level, required_skills)
VALUES (
  'UI/UX Designer', 
  'Design user interfaces and craft engaging user experiences for websites and mobile applications.',
  'skill_based',
  500000, 1800000, 'high',
  ARRAY['Figma', 'User Research', 'Wireframing', 'Visual Design']
);
