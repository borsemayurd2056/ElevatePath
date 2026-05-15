import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Code, Stethoscope, Briefcase, Building2, Palette, TrendingUp } from "lucide-react";

const categories = [
  { value: "all", label: "All", icon: TrendingUp },
  { value: "technology", label: "Technology", icon: Code },
  { value: "medical", label: "Medical", icon: Stethoscope },
  { value: "business", label: "Business", icon: Briefcase },
  { value: "government", label: "Government", icon: Building2 },
  { value: "creative", label: "Creative", icon: Palette },
];

interface Career {
  id: string;
  title: string;
  description: string | null;
  category: string;
  salary_range_min: number | null;
  salary_range_max: number | null;
  demand_level: string | null;
  required_skills: string[] | null;
}

const careerVideoLinks: Record<string, string> = {
  "business operations manager": "https://www.youtube.com/embed/tOJZ6Q5-WUs",
  "business operational manager": "https://www.youtube.com/embed/tOJZ6Q5-WUs",
  "civil servant (ias/ips)": "https://www.youtube.com/embed/jSGkm7dTsH8",
  "civil servant": "https://www.youtube.com/embed/jSGkm7dTsH8",
  "computer science engineer": "https://www.youtube.com/embed/MfOtVvg1r2U",
  "computer science": "https://www.youtube.com/embed/MfOtVvg1r2U",
  "data scientist": "https://www.youtube.com/embed/9R3X0JoCLyU",
  "digital marketing strategist": "https://www.youtube.com/embed/h95cQkEWBx0",
  "digital marketing stratergist": "https://www.youtube.com/embed/h95cQkEWBx0",
  "full stack developer": "https://www.youtube.com/embed/GxmfcnU3feo",
  "mechanical engineering": "https://www.youtube.com/embed/AwaVPJJEjAQ",
  "medical doctor(mbbs)": "https://www.youtube.com/embed/RrKGr3JYCGw",
  "medical doctor (mbbs)": "https://www.youtube.com/embed/RrKGr3JYCGw",
  "medical doctor": "https://www.youtube.com/embed/RrKGr3JYCGw",
  "nda officer": "https://www.youtube.com/embed/xqp7yD7_6mk",
  "polytchni enguneer": "https://www.youtube.com/embed/lqKsBfYFueQ",
  "polytechnic engineer": "https://www.youtube.com/embed/lqKsBfYFueQ",
  "ui/ux designer": "https://www.youtube.com/embed/Q324oRLYhlM",
};

export default function Careers() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("careers").select("*").order("title");
      setCareers(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = filter === "all" ? careers : careers.filter((c) => c.category === filter);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Career Path Explorer</h1>
          <p className="text-muted-foreground">Browse careers by category and find your ideal path</p>
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex-wrap h-auto gap-1">
            {categories.map((c) => (
              <TabsTrigger key={c.value} value={c.value} className="gap-1">
                <c.icon className="h-3.5 w-3.5" /> {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((career, i) => (
              <motion.div key={career.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="h-full hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedCareer(career)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{career.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{career.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {career.required_skills?.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        ₹{((career.salary_range_min || 0) / 100000).toFixed(0)}L - ₹{((career.salary_range_max || 0) / 100000).toFixed(0)}L/yr
                      </span>
                      <Badge variant={career.demand_level === "high" ? "default" : "secondary"}>
                        {career.demand_level} demand
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={!!selectedCareer} onOpenChange={(open) => !open && setSelectedCareer(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedCareer && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedCareer.title}</DialogTitle>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant={selectedCareer.demand_level === "high" ? "default" : "secondary"} className="text-sm">
                      {selectedCareer.demand_level} Market Demand
                    </Badge>
                     <span className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-md">
                        ₹{((selectedCareer.salary_range_min || 0) / 100000).toFixed(1)}L - ₹{((selectedCareer.salary_range_max || 0) / 100000).toFixed(1)}L / year
                      </span>
                  </div>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div>
                     <h4 className="font-semibold text-lg border-b pb-1">Role Overview</h4>
                     <p className="text-muted-foreground mt-2 text-base leading-relaxed">{selectedCareer.description}</p>
                  </div>

                  {selectedCareer.required_skills && selectedCareer.required_skills.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2 border-b pb-1"><Code className="h-5 w-5 text-primary"/> Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.required_skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="px-3 py-1 font-medium bg-primary/5">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t bg-muted/40 rounded-xl p-5 mt-6">
                     <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary"><Briefcase className="h-5 w-5"/> Next Steps To Achieve This</h4>
                     {careerVideoLinks[selectedCareer.title.toLowerCase()] ? (
                       <div className="mt-4 aspect-video rounded-xl overflow-hidden w-full border shadow-sm">
                         <iframe 
                           width="100%" 
                           height="100%" 
                           src={careerVideoLinks[selectedCareer.title.toLowerCase()]} 
                           title="YouTube video player" 
                           frameBorder="0" 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                         ></iframe>
                       </div>
                     ) : (
                       <p className="text-sm text-muted-foreground">Specific next steps and video resources for this career path will be added soon.</p>
                     )}
                  </div>
                  
                  <div className="flex justify-end pt-2">
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
