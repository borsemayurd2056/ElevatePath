import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { GraduationCap, CheckCircle, Calendar, BookOpen } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface Exam {
  id: string;
  name: string;
  full_name: string | null;
  description: string | null;
  eligibility: string | null;
  syllabus_overview: string | null;
  preparation_tips: string[] | null;
  important_dates: Json;
}

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("entrance_exams").select("*").order("name");
      setExams(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Entrance Exam Guide</h1>
          <p className="text-muted-foreground">Everything you need to know about major entrance examinations</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam, i) => (
              <motion.div key={exam.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{exam.name}</CardTitle>
                        <CardDescription>{exam.full_name}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{exam.description}</p>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="eligibility">
                        <AccordionTrigger className="text-sm">
                          <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Eligibility</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {exam.eligibility}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="syllabus">
                        <AccordionTrigger className="text-sm">
                          <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Syllabus Overview</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {exam.syllabus_overview}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="tips">
                        <AccordionTrigger className="text-sm">
                          <span className="flex items-center gap-2">💡 Preparation Tips</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {exam.preparation_tips?.map((tip, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="dates">
                        <AccordionTrigger className="text-sm">
                          <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Important Dates</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-2">
                            {exam.important_dates && typeof exam.important_dates === "object" && !Array.isArray(exam.important_dates) &&
                              Object.entries(exam.important_dates).map(([key, val]) => (
                                <div key={key} className="text-sm">
                                  <span className="font-medium capitalize">{key.replace(/_/g, " ")}:</span>{" "}
                                  <span className="text-muted-foreground">{String(val)}</span>
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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
