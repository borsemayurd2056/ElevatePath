import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, RotateCcw, BrainCircuit, CheckCircle2, Clock, Award, Briefcase, GraduationCap } from "lucide-react";
import { generateAIInsights, EducationStage } from "@/lib/quiz-data";
import { getAdmissionSteps } from "./Courses";

const categoryLabels: Record<string, string> = {
  engineering: "Engineering & Mechanics",
  medical: "Medical & Health",
  management: "Business & Management",
  civil_services: "Civil Services & Govt",
  defense: "Defense & Armed Forces",
  it_software: "IT & Software",
  diploma: "Diploma & Technical",
  skill_based: "Skill & Creative Fields",
  technology: "Technology", // fallback
  business: "Business", // fallback
  government: "Government", // fallback
  creative: "Creative", // fallback
};

const categoryColors: Record<string, string> = {
  it_software: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  engineering: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  medical: "bg-green-500/10 text-green-600 border-green-500/20",
  management: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  civil_services: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  defense: "bg-red-500/10 text-red-600 border-red-500/20",
  diploma: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  skill_based: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  // fallbacks
  technology: "bg-primary/10 text-primary border-primary/20",
  business: "bg-destructive/10 text-destructive border-destructive/20",
  government: "bg-secondary text-secondary-foreground border-border",
  creative: "bg-primary/10 text-primary border-primary/20",
};

interface Career {
  id: string;
  title: string;
  description: string;
  category: string;
  salary_range_min: number;
  salary_range_max: number;
  demand_level: string;
  required_skills: string[];
}

export default function Results() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<{ category: string; score: number }[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [aiInsight, setAiInsight] = useState<{message: string, nextSteps: string[]} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      const { data: quizData } = await supabase
        .from("quiz_responses")
        .select("results, education_stage")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!quizData?.results) {
        setLoading(false);
        return;
      }

      const parsedResults = quizData.results as { category: string; score: number }[];
      setResults(parsedResults);

      const stage = (quizData.education_stage as EducationStage) || "after_12th_science";
      setAiInsight(generateAIInsights(parsedResults, stage));

      const topCategories = parsedResults.slice(0, 3).map((r) => r.category);
      
      const { data: careerData } = await supabase
        .from("careers")
        .select("*")
        .in("category", topCategories as any[]);

      setCareers(careerData || []);
      setLoading(false);
    };
    fetchResults();
  }, [user]);

  const maxScore = results[0]?.score || 100;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground animate-pulse">Analyzing your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!results.length) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">No Results Yet</h1>
          <p className="text-lg text-muted-foreground">Take the career quiz to discover your personalized, AI-driven recommendations.</p>
          <Button size="lg" className="mt-4" onClick={() => navigate("/quiz")}>Take the Quiz</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 py-6">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your Career Matches</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your unique responses, we've mapped out the career pathways that perfectly align with your aspirations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: AI Insights & Scores */}
          <div className="lg:col-span-5 space-y-8">
            {/* AI Insights Card */}
            {aiInsight && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-2 border-primary/20 shadow-lg bg-primary/5 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <BrainCircuit className="h-24 w-24" />
                  </div>
                  <CardHeader className="pb-3 border-b border-primary/10 bg-primary/10">
                    <CardTitle className="flex items-center gap-2 text-xl text-primary">
                      <BrainCircuit className="h-5 w-5" /> AI Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6 relative z-10">
                    <p className="font-medium text-foreground leading-relaxed text-[15px]">
                      {aiInsight.message}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Suggested Next Steps</h4>
                      <ul className="space-y-2">
                        {aiInsight.nextSteps.map((step, idx) => (
                          <li key={idx} className="flex flex-start gap-2 text-sm bg-background/60 p-2.5 rounded-lg border border-primary/10 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Score Bars */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Aptitude Profile</h3>
              <div className="grid gap-3">
                {results.slice(0, 4).map((r, i) => (
                  <div key={r.category} className="flex items-center gap-4 bg-card p-3 rounded-xl border shadow-sm">
                    <span className="text-xl font-bold text-muted-foreground/50 w-6">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-semibold">{categoryLabels[r.category] || r.category}</span>
                        <span className="text-sm font-bold text-primary">{Math.round((r.score / maxScore) * 100)}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${i === 0 ? 'bg-primary' : 'bg-primary/60'}`}
                          style={{ width: `${(r.score / maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Career Recommendations */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-2xl font-bold">Recommended Pathways</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                Top {careers.slice(0, 6).length} Matches
              </span>
            </div>
            
            {careers.length === 0 ? (
              <div className="text-center p-10 border-2 border-dashed rounded-xl bg-muted/50">
                <p className="text-muted-foreground">Your specific domains do not have detailed careers mapped yet, but you are uniquely suited for {categoryLabels[results[0]?.category]}.</p>
                <p className="text-sm mt-2">Run the Supabase SQL seed to populate these specific granular domains.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {careers.slice(0, 6).map((career, i) => (
                  <motion.div key={career.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:border-primary/40 group flex flex-col cursor-pointer" onClick={() => setSelectedCareer(career)}>
                      <CardHeader className="pb-3 flex-none">
                        <div className="space-y-2">
                          <div className={`inline-block text-xs px-2.5 py-1 rounded-md font-medium border ${categoryColors[career.category] || categoryColors.technology}`}>
                            {categoryLabels[career.category] || career.category}
                          </div>
                          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{career.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {career.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {career.required_skills?.slice(0, 3).map((skill) => (
                              <span key={skill} className="text-[11px] bg-secondary px-2 py-0.5 rounded-sm font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t mt-auto">
                          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>₹{(career.salary_range_min / 100000).toFixed(1)}L - {(career.salary_range_max / 100000).toFixed(1)}L</span>
                            <span className={career.demand_level === "high" ? "text-green-600 font-bold bg-green-500/10 px-2 py-0.5 rounded-sm" : ""}>
                              {career.demand_level?.toUpperCase()} DEMAND
                            </span>
                          </div>
                          <Link to={`/careers`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                              View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="pt-6 flex justify-center">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/quiz")}>
                <RotateCcw className="mr-2 h-4 w-4" /> Retake Quiz for a different stage
              </Button>
            </div>
          </div>

        </div>

        <Dialog open={!!selectedCareer} onOpenChange={(open) => !open && setSelectedCareer(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedCareer && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedCareer.title}</DialogTitle>
                  <DialogDescription className="text-base mt-2 whitespace-pre-wrap">
                    {selectedCareer.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-muted/40 p-4 rounded-xl">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/> Typical Duration</p>
                      <p className="font-semibold">Varies by pathway</p>
                    </div>
                    <div className="space-y-1 bg-muted/40 p-4 rounded-xl">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Award className="h-4 w-4"/> Basic Eligibility</p>
                      <p className="font-semibold">{getAdmissionSteps(selectedCareer.title)[0] || "Check official criteria"}</p>
                    </div>
                  </div>

                  {selectedCareer.required_skills && selectedCareer.required_skills.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg border-b pb-1">Core Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.required_skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="px-3 py-1 font-medium">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center gap-2 border-b pb-1"><Briefcase className="h-5 w-5 text-primary"/> Career Snapshot</h4>
                    <ul className="list-none space-y-2">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-primary/50" />
                        <span className="font-medium text-foreground/80">Salary range: ₹{(selectedCareer.salary_range_min / 100000).toFixed(1)}L - {(selectedCareer.salary_range_max / 100000).toFixed(1)}L</span>
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-primary/50" />
                        <span className="font-medium text-foreground/80">Demand: {selectedCareer.demand_level?.toUpperCase() || "N/A"}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 bg-primary/5 p-6 rounded-xl border border-primary/10 mt-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5">
                      <GraduationCap className="h-32 w-32" />
                    </div>
                    <h4 className="font-semibold text-xl flex items-center gap-2 border-b border-primary/20 pb-3 text-primary relative z-10">
                      <GraduationCap className="h-6 w-6"/> How to Get In
                    </h4>
                    <div className="space-y-4 relative z-10 pt-2">
                      {getAdmissionSteps(selectedCareer.title).map((step, index, arr) => (
                        <div key={index} className="flex gap-4 relative">
                          {index !== arr.length - 1 && (
                            <div className="absolute left-[13px] top-[26px] bottom-[-16px] w-[2px] bg-primary/20"></div>
                          )}
                          <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                            {index + 1}
                          </div>
                          <p className="font-medium pt-0.5 text-foreground leading-snug">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t flex justify-between items-center">
                     <p className="text-sm text-muted-foreground italic">Pathway data provided by Career Navigator Pro</p>
                     <Button onClick={() => setSelectedCareer(null)}>Close Window</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
