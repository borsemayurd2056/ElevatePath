import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Newspaper, BookOpen } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
}

// Static fallback resources when DB is empty
const fallbackResources = [
  { id: "1", title: "How to Choose the Right Career After 12th", content: "Choosing a career after 12th is one of the most important decisions. Consider your interests, strengths, and the job market. Take career assessment tests, talk to professionals in fields you're interested in, and research about different courses and their scope. Remember, it's okay to explore before you commit.", category: "Career Advice", created_at: new Date().toISOString() },
  { id: "2", title: "Top 10 Skills Employers Look For in 2026", content: "The job market is evolving rapidly. Key skills include: 1) Critical thinking and problem-solving, 2) Digital literacy, 3) Communication skills, 4) Adaptability, 5) Data analysis, 6) AI and machine learning basics, 7) Project management, 8) Emotional intelligence, 9) Creativity, 10) Cybersecurity awareness.", category: "Skills", created_at: new Date().toISOString() },
  { id: "3", title: "Government Job Preparation: A Complete Guide", content: "Preparing for government exams requires discipline and strategy. Start early, understand the syllabus thoroughly, make a study schedule, practice previous year papers, stay updated with current affairs, and take mock tests regularly. Focus on your weak areas and revise consistently.", category: "Government Jobs", created_at: new Date().toISOString() },
  { id: "4", title: "Why Internships Matter for Your Career", content: "Internships provide real-world experience, help build professional networks, enhance your resume, and sometimes lead to full-time job offers. Start looking for internships from your second year of college. Use platforms like Internshala, LinkedIn, and your college placement cell.", category: "Career Advice", created_at: new Date().toISOString() },
  { id: "5", title: "Freelancing vs Full-Time Job: What's Right for You?", content: "Both paths have their pros and cons. Full-time jobs offer stability, benefits, and structured growth. Freelancing offers flexibility, variety, and potentially higher earnings. Consider your personality, financial needs, and career goals before deciding. Many professionals combine both approaches.", category: "Career Advice", created_at: new Date().toISOString() },
];

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      setResources(data && data.length > 0 ? data : fallbackResources);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">Frequently asked questions, guides, and advice to help you on your career journey</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {resources.map((res, i) => (
              <motion.div key={res.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{res.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {res.category && <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{res.category}</span>}
                          <span className="text-xs text-muted-foreground">{new Date(res.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{res.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
