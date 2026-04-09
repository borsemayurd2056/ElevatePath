import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Users, MessageSquare, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MentorWithProfile {
  user_id: string;
  expertise: string[];
  experience_years: number;
  title: string | null;
  profiles: { full_name: string; avatar_url: string | null; bio: string | null } | null;
}

export default function Mentors() {
  const [mentors, setMentors] = useState<MentorWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("mentor_profiles")
        .select("user_id, expertise, experience_years, title, profiles!mentor_profiles_user_id_fkey(full_name, avatar_url, bio)")
        .order("experience_years", { ascending: false });
      setMentors((data as any) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Find Mentors</h1>
          <p className="text-muted-foreground">Connect with experienced professionals for career guidance</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : mentors.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">No Mentors Available Yet</h2>
              <p className="text-muted-foreground">Mentors will appear here once they create their profiles.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.map((mentor, i) => {
              const profile = mentor.profiles;
              const initials = (profile?.full_name || "M").split(" ").map(n => n[0]).join("").slice(0, 2);
              return (
                <motion.div key={mentor.user_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{profile?.full_name || "Mentor"}</h3>
                          {mentor.title && <p className="text-sm text-muted-foreground">{mentor.title}</p>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{profile?.bio || "Experienced professional"}</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 3).map((exp) => (
                          <Badge key={exp} variant="secondary" className="text-xs">{exp}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{mentor.experience_years} years experience</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate("/ask-mentor")}>
                          <MessageSquare className="mr-1 h-3 w-3" /> Ask
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => navigate("/book-session")}>
                          <Calendar className="mr-1 h-3 w-3" /> Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
