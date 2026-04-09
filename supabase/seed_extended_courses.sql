-- INSERT MASSIVE COURSE LIST INTO Supabase `courses` TABLE
-- Table schema check/fallback just in case
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

INSERT INTO public.courses (name, description, duration, eligibility, category, education_stages)
VALUES 
-- 🎓 AFTER 10TH (Streams & Foundation)
('Science Stream (PCM/PCB)', 'A critical 2-year foundational course focusing on Physics, Chemistry, Math or Biology.', '2 Years', 'Passed 10th standard', 'education', ARRAY['after_10th'::education_stage]),
('Commerce Stream', 'A 2-year course focusing on economics, accountancy, and business studies.', '2 Years', 'Passed 10th standard', 'business', ARRAY['after_10th'::education_stage]),
('Arts/Humanities Stream', 'A 2-year course emphasizing social sciences, languages, and history.', '2 Years', 'Passed 10th standard', 'creative', ARRAY['after_10th'::education_stage]),

-- 🎓 AFTER 10TH (Diploma Courses)
('Diploma in Computer Engineering', 'A foundational 3-year technical degree focusing on computer science basics, coding, and hardware.', '3 Years', 'Passed 10th standard', 'technology', ARRAY['after_10th'::education_stage]),
('Diploma in Mechanical Engineering', 'Automotive and mechanical systems training bypassing traditional 11th/12th schooling.', '3 Years', 'Passed 10th standard', 'technology', ARRAY['after_10th'::education_stage]),
('Diploma in Civil Engineering', 'Learning the basics of design, construction, and infrastructure maintenance.', '3 Years', 'Passed 10th standard', 'technology', ARRAY['after_10th'::education_stage]),
('Diploma in Electrical Engineering', 'Understanding core electrical concepts, circuits, and energy systems.', '3 Years', 'Passed 10th standard', 'technology', ARRAY['after_10th'::education_stage]),

-- 🎓 AFTER 10TH (Other Options)
('ITI Certificate (Electrician, Fitter)', 'Industrial Training Institute certificate for direct factory/field placement.', '1-2 Years', 'Passed 10th standard', 'skill_based', ARRAY['after_10th'::education_stage]),
('NDA Preparation Course', 'Intense academic and physical coaching for National Defence Academy.', '1-2 Years', 'Passed 10th standard', 'defense', ARRAY['after_10th'::education_stage]),
('Basic Coding (HTML, CSS, Python)', 'Short term certification course for programming fundamentals.', '3-6 Months', 'None', 'technology', ARRAY['after_10th'::education_stage]),
('Graphic Designing Certification', 'Learning Photoshop, Illustrator, and foundational design concepts.', '3-6 Months', 'None', 'creative', ARRAY['after_10th'::education_stage]),

-- 🎓 AFTER 12TH (Engineering)
('B.Tech in Computer Science', 'Software development, OS, databases, and algorithms.', '4 Years', '12th Science PCM', 'technology', ARRAY['after_12th_science'::education_stage]),
('B.Tech in AI & Data Science', 'Specialized engineering degree covering machine learning, statistical models, and AI.', '4 Years', '12th Science PCM', 'technology', ARRAY['after_12th_science'::education_stage]),
('B.Tech in Mechanical Engineering', 'Core engineering of machines, thermodynamics, and manufacturing.', '4 Years', '12th Science PCM', 'technology', ARRAY['after_12th_science'::education_stage]),
('B.Tech in Civil Engineering', 'Core engineering regarding infrastructure, dams, bridges, and city planning.', '4 Years', '12th Science PCM', 'technology', ARRAY['after_12th_science'::education_stage]),

-- 🎓 AFTER 12TH (Medical)
('MBBS (Bachelor of Medicine)', 'Premier undergraduate medical degree for general physicians/surgeons.', '5.5 Years', '12th Science PCB', 'medical', ARRAY['after_12th_science'::education_stage]),
('BDS (Bachelor of Dental Surgery)', 'Undergraduate degree focusing on dental health and surgery.', '5 Years', '12th Science PCB', 'medical', ARRAY['after_12th_science'::education_stage]),
('B.Pharmacy', 'Study of pharmaceuticals, drug synthesis, and dispensing.', '4 Years', '12th Science PCB/PCM', 'medical', ARRAY['after_12th_science'::education_stage]),
('B.Sc Nursing', 'Intense nursing and patient-care undergraduate degree.', '4 Years', '12th Science PCB', 'medical', ARRAY['after_12th_science'::education_stage]),

-- 🎓 AFTER 12TH (Commerce)
('Bachelor of Commerce (B.Com)', 'Undergraduate degree focusing on commerce, accounting, and finance.', '3 Years', '12th Commerce', 'business', ARRAY['after_12th_commerce'::education_stage]),
('Bachelor of Business Admin (BBA)', 'Undergraduate management and entrepreneurial degree.', '3 Years', '12th Commerce/Science/Arts', 'business', ARRAY['after_12th_commerce'::education_stage, 'after_12th_science'::education_stage, 'after_12th_arts'::education_stage]),
('Chartered Accountant (CA)', 'Premier Indian accounting certification.', '3-5 Years', '12th standard clear', 'business', ARRAY['after_12th_commerce'::education_stage]),
('Company Secretary (CS)', 'Corporate law and compliance certification.', '3-4 Years', '12th standard clear', 'business', ARRAY['after_12th_commerce'::education_stage]),

-- 🎓 AFTER 12TH (Arts)
('Bachelor of Arts (BA)', 'Social sciences, languages, humanities.', '3 Years', '12th Arts/Any', 'creative', ARRAY['after_12th_arts'::education_stage]),
('Journalism & Mass Communication', 'Media studies, broadcasting, journalism.', '3 Years', '12th Any Stream', 'creative', ARRAY['after_12th_arts'::education_stage, 'after_12th_science'::education_stage, 'after_12th_commerce'::education_stage]),
('B.Sc Psychology', 'Behavioral science, mental health, therapy basis.', '3 Years', '12th Any Stream', 'medical', ARRAY['after_12th_arts'::education_stage, 'after_12th_science'::education_stage]),
('Law (LLB via CLAT)', '5-year integrated law degree.', '5 Years', '12th Any Stream', 'government', ARRAY['after_12th_arts'::education_stage, 'after_12th_science'::education_stage, 'after_12th_commerce'::education_stage]),

-- 🎓 AFTER 12TH (Entrance Exams Preparation)
('JEE Preparation Masterclass', 'Coaching specifically aligned for clearing IIT/NIT entrance exams.', '1-2 Years', '12th Science PCM', 'education', ARRAY['after_12th_science'::education_stage]),
('NEET Preparation Masterclass', 'Medical entrance prep for top Indian medical colleges.', '1-2 Years', '12th Science PCB', 'education', ARRAY['after_12th_science'::education_stage]),
('MHT-CET / State Engineering Prep', 'State board engineering and pharmacy entrance preparation.', '1 Year', '12th Science PCM/PCB', 'education', ARRAY['after_12th_science'::education_stage]),
('CLAT Preparation Course', 'National Law Universities entrance exam preparation.', '1 Year', '12th Any Stream', 'education', ARRAY['after_12th_science'::education_stage, 'after_12th_commerce'::education_stage, 'after_12th_arts'::education_stage]),

-- 🎓 AFTER GRADUATION (Higher Studies)
('MBA (Finance, Marketing, HR)', 'Postgraduate degree in business administration.', '2 Years', 'Bachelor''s Degree', 'business', ARRAY['after_graduation'::education_stage]),
('M.Tech (Master of Technology)', 'Postgraduate technical degree for specialization in engineering.', '2 Years', 'B.Tech/BE', 'technology', ARRAY['after_graduation'::education_stage]),
('M.Sc (IT, Data Science)', 'Postgraduate degree focusing on sciences and computing.', '2 Years', 'B.Sc/BCA/B.Tech', 'technology', ARRAY['after_graduation'::education_stage]),

-- 🎓 AFTER GRADUATION (Government Exams)
('UPSC Civil Services Prep', 'Rigorous preparation for IAS, IPS, IFS ranks.', '1-2 Years +', 'Bachelor''s Degree', 'government', ARRAY['after_graduation'::education_stage]),
('MPSC / State PSC Prep', 'State-level civil service preparations.', '1-2 Years', 'Bachelor''s Degree', 'government', ARRAY['after_graduation'::education_stage]),
('SSC CGL & Banking Exams Prep', 'Preparation for rapid-placement government administration and bank jobs.', '6-12 Months', 'Bachelor''s Degree', 'government', ARRAY['after_graduation'::education_stage]),

-- 🎓 AFTER GRADUATION (Skill-Based Courses)
('Full Stack Web Development Bootcamp', 'MERN/Next.js stack coding bootcamp for direct tech jobs.', '6 Months', 'Any Degree', 'technology', ARRAY['after_graduation'::education_stage]),
('Data Science & AI Bootcamp', 'Python, PyTorch, Pandas, and machine learning models crash course.', '6-9 Months', 'Any Degree (Math preferred)', 'technology', ARRAY['after_graduation'::education_stage]),
('Cybersecurity & Ethical Hacking', 'Securing networks, ethical hacking, and penetration testing.', '6 Months', 'Any Degree', 'technology', ARRAY['after_graduation'::education_stage]),
('Cloud Computing Certification (AWS/Azure)', 'Mastering cloud deployment, DevOps, and scalable infrastructure.', '3-6 Months', 'Tech Degree', 'technology', ARRAY['after_graduation'::education_stage]),
('Digital Marketing Masterclass', 'SEO, social media, content strategies, and analytics.', '3 Months', 'Any Degree', 'business', ARRAY['after_graduation'::education_stage]),
('UI/UX Design Certification', 'User experience philosophy, wireframing, and Figma mastery.', '3-6 Months', 'Any Degree', 'creative', ARRAY['after_graduation'::education_stage]),

-- 🚀 TRENDING / FUTURE COURSES (Accessible across stages)
('Artificial Intelligence Principles', 'Basics of AI modeling, logic, and implementation.', '6 Months', 'Basic Tech proficiency', 'technology', ARRAY['after_12th_science'::education_stage, 'after_graduation'::education_stage]),
('Advanced Machine Learning', 'Deep learning, neural networks, and computer vision.', '8 Months', 'Tech Degree', 'technology', ARRAY['after_graduation'::education_stage]),
('Big Data Analytics', 'Handling massive datasets with Hadoop, Spark, and SQL.', '6 Months', 'Strong Math/Tech', 'technology', ARRAY['after_graduation'::education_stage]),
('Blockchain Development (Web3)', 'Smart contracts, Solidity, Ethereum, and crypto network engineering.', '6 Months', 'Coding proficiency', 'technology', ARRAY['after_12th_science'::education_stage, 'after_graduation'::education_stage]),
('Robotics & Automation', 'Integrating software with mechanical engineering for automated systems.', '1 Year', 'Engineering Degree preferred', 'technology', ARRAY['after_graduation'::education_stage]),
('Prompt Engineering & Generative AI', 'Structuring queries and managing LLMs (ChatGPT, Claude, etc).', '2 Months', 'None', 'technology', ARRAY['after_10th'::education_stage, 'after_12th_science'::education_stage, 'after_graduation'::education_stage, 'after_12th_commerce'::education_stage, 'after_12th_arts'::education_stage]);
