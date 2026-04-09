-- INSERT SEED DATA FOR COURSES & EXAMS

-- Create Courses Table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  eligibility TEXT,
  required_skills TEXT[],
  career_opportunities TEXT[],
  category TEXT,
  education_stages education_stage[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We are using ON CONFLICT logic or just letting them duplicate if run multiple times.
-- To keep it clean, we can optionally TRUNCATE public.courses

-- Insert into courses
INSERT INTO public.courses (name, description, duration, eligibility, required_skills, career_opportunities, category, education_stages)
VALUES 
(
  'B.Tech in Computer Science',
  'A 4-year undergraduate engineering degree focusing on programming, algorithms, and software development.',
  '4 Years',
  '10+2 with Physics, Chemistry, Mathematics (PCM)',
  ARRAY['Programming', 'Mathematics', 'Logical Reasoning', 'Problem Solving'],
  ARRAY['Software Engineer', 'Data Scientist', 'System Analyst'],
  'technology',
  ARRAY['after_12th_science'::education_stage]
),
(
  'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
  'A comprehensive 5.5-year medical degree to become a certified doctor.',
  '5.5 Years',
  '10+2 with Physics, Chemistry, Biology (PCB)',
  ARRAY['Biology', 'Empathy', 'Memory', 'Clinical Skills'],
  ARRAY['General Physician', 'Surgeon', 'Medical Researcher'],
  'medical',
  ARRAY['after_12th_science'::education_stage]
),
(
  'Bachelor of Business Administration (BBA)',
  'A 3-year undergraduate course offering fundamental education in management and business principles.',
  '3 Years',
  '10+2 in any stream (Commerce preferred)',
  ARRAY['Communication', 'Leadership', 'Basic Accounting', 'Management'],
  ARRAY['Business Analyst', 'HR Manager', 'Marketing Executive'],
  'business',
  ARRAY['after_12th_commerce'::education_stage, 'after_12th_arts'::education_stage, 'after_12th_science'::education_stage]
),
(
  'Diploma in Mechanical Engineering',
  'A 3-year foundational program focusing on mechanics, thermodynamics, and robotics.',
  '3 Years',
  '10th Grade Pass',
  ARRAY['Physics', 'Technical Drawing', 'Practical Skills'],
  ARRAY['Junior Engineer', 'Technician', 'Quality Inspector'],
  'technology',
  ARRAY['after_10th'::education_stage]
),
(
  'Bachelor of Arts (BA)',
  'A 3-year program focusing on humanities, social sciences, and languages.',
  '3 Years',
  '10+2 in any stream',
  ARRAY['Writing', 'Critical Thinking', 'Research'],
  ARRAY['Civil Servant', 'Journalist', 'Teacher'],
  'creative',
  ARRAY['after_12th_arts'::education_stage]
);

-- Create Entrance Exams Table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.entrance_exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT,
  description TEXT,
  eligibility TEXT,
  syllabus_overview TEXT,
  preparation_tips TEXT[],
  important_dates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert into entrance exams
INSERT INTO public.entrance_exams (name, full_name, description, eligibility, syllabus_overview, preparation_tips, important_dates)
VALUES 
(
  'JEE Main',
  'Joint Entrance Examination',
  'A highly competitive national-level engineering entrance exam in India for admission to NITs, IIITs, and other premier instutions.',
  '10+2 with PCM',
  'Physics, Chemistry, and Mathematics of 11th and 12th grade level.',
  ARRAY['Focus on NCERT books first', 'Take regular mock tests', 'Master time management'],
  '{"registration": "December to January", "exam_dates": "January & April Sessions"}'::jsonb
),
(
  'NEET (UG)',
  'National Eligibility cum Entrance Test',
  'The premier pre-medical entrance test in India for students who wish to pursue undergraduate medical courses.',
  '10+2 with PCB',
  'Physics, Chemistry, Botany, and Zoology of 11th and 12th grade.',
  ARRAY['Biology NCERT is the bible', 'Practice numericals in Physics daily', 'Revise organic chemistry thoroughly'],
  '{"registration": "February to March", "exam_dates": "May (First Sunday)"}'::jsonb
),
(
  'NDA Exam',
  'National Defence Academy Examination',
  'A national-level exam conducted by UPSC for admission to the Army, Navy and Air Force wings of the NDA.',
  '10+2 (PCM required for Navy/Air Force)',
  'Mathematics and General Ability Test (English, General Knowledge, Physics, Chemistry, History).',
  ARRAY['Maintain peak physical fitness', 'Read daily newspapers for current affairs', 'Practice previous year UPSC papers'],
  '{"registration": "December (NDA 1) / May (NDA 2)", "exam_dates": "April & September"}'::jsonb
),
(
  'CAT',
  'Common Admission Test',
  'A computer-based test for admission to graduate management programs (MBA).',
  'Bachelor''s Degree with at least 50% marks',
  'Verbal Ability and Reading Comprehension, Data Interpretation and Logical Reasoning, and Quantitative Ability.',
  ARRAY['Build a strong reading habit', 'Practice mental math', 'Take weekly full-length mock tests'],
  '{"registration": "August to September", "exam_dates": "November (Last Sunday)"}'::jsonb
);
