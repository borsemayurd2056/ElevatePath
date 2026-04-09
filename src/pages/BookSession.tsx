import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CalendarDays, Clock, CheckCircle } from "lucide-react";

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

interface MentorOption {
  user_id: string;
  title: string | null;
  profiles: { full_name: string } | null;
}

interface Session {
  id: string;
  scheduled_date: string;
  time_slot: string;
  status: string;
  mentor_id: string;
}

export default function BookSession() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<MentorOption[]>([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data: mentorData } = await supabase
        .from("mentor_profiles")
        .select("user_id, title, profiles!mentor_profiles_user_id_fkey(full_name)");
      setMentors((mentorData as any) || []);

      if (user) {
        const { data: sessionData } = await supabase
          .from("mentorship_sessions")
          .select("*")
          .eq("student_id", user.id)
          .order("scheduled_date", { ascending: false });
        setSessions(sessionData || []);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const bookSession = async () => {
    if (!selectedMentor || !selectedDate || !selectedSlot || !user) return;
    setBooking(true);
    const { error } = await supabase.from("mentorship_sessions").insert({
      student_id: user.id,
      mentor_id: selectedMentor,
      scheduled_date: selectedDate.toISOString().split("T")[0],
      time_slot: selectedSlot,
    });
    if (error) {
      toast.error("Failed to book session");
    } else {
      toast.success("Session booked successfully!");
      setSelectedMentor("");
      setSelectedDate(undefined);
      setSelectedSlot("");
      // Refresh sessions
      const { data } = await supabase
        .from("mentorship_sessions")
        .select("*")
        .eq("student_id", user.id)
        .order("scheduled_date", { ascending: false });
      setSessions(data || []);
    }
    setBooking(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Book a Mentorship Session</h1>
          <p className="text-muted-foreground">Schedule a one-on-one session with a mentor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schedule New Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Mentor</label>
                <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((m) => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.profiles?.full_name || "Mentor"} {m.title ? `(${m.title})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 text-xs rounded-lg border transition-all ${
                        selectedSlot === slot
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <Clock className="h-3 w-3 mx-auto mb-1" />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={bookSession} disabled={!selectedMentor || !selectedDate || !selectedSlot || booking}>
                <CalendarDays className="mr-2 h-4 w-4" />
                {booking ? "Booking..." : "Book Session"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Sessions</h2>
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No sessions booked yet
                </CardContent>
              </Card>
            ) : (
              sessions.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{new Date(s.scheduled_date).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{s.time_slot}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        s.status === "confirmed" ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
                      }`}>
                        {s.status}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
