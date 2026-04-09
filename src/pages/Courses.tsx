import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Search, Clock, Award, Briefcase, GraduationCap, CheckCircle2, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const getAdmissionSteps = (name: string): string[] => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("science stream")) return ["Pass 10th board exams", "Choose Science stream in 11th", "Select PCM (Engineering) or PCB (Medical)"];
  if (lowerName.includes("commerce")) return ["Pass 10th board exams", "Choose Commerce stream in 11th"];
  if (lowerName.includes("arts") || lowerName.includes("humanities")) return ["Pass 10th board exams", "Choose Arts stream in 11th"];
  if (lowerName.includes("diploma")) return ["Pass 10th", "Apply through Polytechnic / State CET counseling", "Select branch (Computer, Mechanical, Civil, etc.)"];
  if (lowerName.includes("iti")) return ["Pass 10th", "Apply to ITI institutes", "Choose trade (Electrician, Fitter, etc.)"];
  if (lowerName.includes("nda")) return ["Pass 12th (PCM preferred) or 10th to continue 12th", "Apply through NDA exam", "Clear written exam + SSB interview + physical test"];
  if (lowerName.includes("b.tech") || lowerName.includes("engineering")) return ["Complete 12th with PCM", "Appear for JEE / CET test", "Participate in counseling", "Get college based on rank"];
  if (lowerName.includes("mbbs") || lowerName.includes("bds") || lowerName.includes("pharmacy") || lowerName.includes("nursing") || lowerName.includes("medical")) return ["Complete 12th with PCB", "Appear for NEET exam", "Counseling based on score"];
  if (lowerName.includes("b.com")) return ["Pass 12th (any stream, preferably Commerce)", "Direct admission or merit-based"];
  if (lowerName.includes("bba")) return ["Pass 12th", "Some colleges may require entrance exams", "Direct/merit admission possible"];
  if (lowerName.includes("chartered accountant") || lowerName.includes("ca ")) return ["Register for CA Foundation after 12th", "Clear Foundation → Intermediate → Final"];
  if (lowerName.includes("company secretary") || lowerName.includes("cs ")) return ["Register after 12th", "Clear Foundation → Executive → Professional"];
  if (lowerName.includes("law") || lowerName.includes("llb") || lowerName.includes("clat")) return ["Pass 12th", "Appear for CLAT exam", "Get admission in law colleges"];
  if (lowerName.includes("journalism") || lowerName.includes("psychology") || lowerName.match(/\bba\b/)) return ["Pass 12th", "Direct admission or merit-based"];
  if (lowerName.includes("mba")) return ["Complete graduation", "Appear for CAT / CET / other exams", "GD/PI rounds for selection"];
  if (lowerName.includes("m.tech")) return ["B.Tech degree", "Appear for GATE exam", "Admission based on score"];
  if (lowerName.includes("m.sc")) return ["Graduation in relevant field", "Merit or entrance-based admission"];
  if (lowerName.includes("upsc") || lowerName.includes("civil services")) return ["Graduate in any field", "Clear Prelims → Mains → Interview"];
  if (lowerName.includes("mpsc") || lowerName.includes("ssc") || lowerName.includes("banking")) return ["Graduate", "Clear respective competitive exams"];
  if (lowerName.includes("full stack") || lowerName.includes("data science") || lowerName.includes("artificial intelligence") || lowerName.includes("machine learning") || lowerName.includes("blockchain") || lowerName.includes("prompt")) return ["Open to all (12th / Graduation)", "Learn via online/offline courses", "Build projects + portfolio"];
  if (lowerName.includes("cybersecurity") || lowerName.includes("cloud") || lowerName.includes("marketing") || lowerName.includes("ui/ux") || lowerName.includes("design") || lowerName.includes("coding")) return ["No strict eligibility", "Learn skills + certifications", "Practice + internships"];
  
  return ["Check specific institutional requirements", "Apply through respective admission portals"];
};

interface Course {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  eligibility: string | null;
  duration: string | null;
  required_skills: string[] | null;
  career_opportunities: string[] | null;
  education_stages: string[] | null;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("courses").select("*").order("name");
      setCourses(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStage = filterStage === "all" || (c.education_stages && c.education_stages.includes(filterStage));
    return matchesSearch && matchesStage;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Course Finder</h1>
          <p className="text-muted-foreground">Search and explore courses to build your career</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Education Stage" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="after_10th">After 10th</SelectItem>
              <SelectItem value="after_12th_science">After 12th (Science)</SelectItem>
              <SelectItem value="after_12th_commerce">After 12th (Commerce)</SelectItem>
              <SelectItem value="after_12th_arts">After 12th (Arts)</SelectItem>
              <SelectItem value="after_graduation">After Graduation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="h-full hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedCourse(course)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{course.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="space-y-1.5 text-sm">
                      {course.duration && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> {course.duration}
                        </div>
                      )}
                      {course.eligibility && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-3.5 w-3.5" /> <span className="line-clamp-1">{course.eligibility}</span>
                        </div>
                      )}
                    </div>
                    {course.education_stages && course.education_stages.length > 0 && (
                      <div className="pt-1">
                        <div className="flex flex-wrap gap-1.5">
                          {course.education_stages.map((stage) => (
                            <Badge key={stage} variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 capitalize">
                              {stage.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {course.career_opportunities && course.career_opportunities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> Career Paths
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {course.career_opportunities.slice(0, 3).map((opp) => (
                            <Badge key={opp} variant="secondary" className="text-xs">{opp}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedCourse && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedCourse.name}</DialogTitle>
                  <DialogDescription className="text-base mt-2 whitespace-pre-wrap">
                    {selectedCourse.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-muted/40 p-4 rounded-xl">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/> Duration</p>
                      <p className="font-semibold">{selectedCourse.duration || "N/A"}</p>
                    </div>
                    <div className="space-y-1 bg-muted/40 p-4 rounded-xl">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Award className="h-4 w-4"/> Eligibility</p>
                      <p className="font-semibold">{selectedCourse.eligibility || "N/A"}</p>
                    </div>
                  </div>
                  
                  {selectedCourse.required_skills && selectedCourse.required_skills.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg border-b pb-1">Core Skills Learned</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.required_skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="px-3 py-1 font-medium">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.career_opportunities && selectedCourse.career_opportunities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2 border-b pb-1"><Briefcase className="h-5 w-5 text-primary"/> Career Roadmap</h4>
                      <ul className="list-none space-y-2">
                        {selectedCourse.career_opportunities.map((opp) => (
                          <li key={opp} className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-primary/50" />
                            <span className="font-medium text-foreground/80">{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-4 bg-primary/5 p-6 rounded-xl border border-primary/10 mt-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5">
                      <GraduationCap className="h-32 w-32" />
                    </div>
                    <h4 className="font-semibold text-xl flex items-center gap-2 border-b border-primary/20 pb-3 text-primary relative z-10">
                      <GraduationCap className="h-6 w-6"/> How to Get In
                    </h4>
                    <div className="space-y-4 relative z-10 pt-2">
                      {getAdmissionSteps(selectedCourse.name).map((step, index, arr) => (
                        <div key={index} className="flex gap-4 relative">
                          {/* Timeline vertical line */}
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
                     <p className="text-sm text-muted-foreground italic">Course data provided by Career Navigator Pro</p>
                     <Button onClick={() => setSelectedCourse(null)}>Close Window</Button>
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
