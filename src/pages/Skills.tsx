import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Career {
  id: string;
  title: string;
  category: string;
  required_skills: string[] | null;
}

export default function Skills() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("careers").select("id, title, category, required_skills").order("title");
      setCareers(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Skills & Roadmap</h1>
          <p className="text-muted-foreground">Discover skills needed for each career path</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {careers.map((career, i) => (
              <motion.div key={career.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{career.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {career.required_skills?.map((skill, j) => {
                      const proficiency = Math.max(50, 95 - j * 8);
                      return (
                        <div key={skill} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{skill}</span>
                            <span className="text-muted-foreground">{proficiency}%</span>
                          </div>
                          <Progress value={proficiency} className="h-1.5" />
                        </div>
                      );
                    })}
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
