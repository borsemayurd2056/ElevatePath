import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";

interface Question {
  id: string;
  question: string;
  answer: string | null;
  created_at: string;
  answered_at: string | null;
}

export default function AskMentor() {
  const { user, userRole } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = async () => {
    if (!user) return;
    let query = supabase.from("mentor_questions").select("*").order("created_at", { ascending: false });
    if (userRole === "student") {
      query = query.eq("student_id", user.id);
    }
    const { data } = await query;
    setQuestions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, [user, userRole]);

  const submitQuestion = async () => {
    if (!newQuestion.trim() || !user) return;
    setSubmitting(true);
    const { error } = await supabase.from("mentor_questions").insert({
      student_id: user.id,
      question: newQuestion.trim(),
    });
    if (error) {
      toast.error("Failed to submit question");
    } else {
      toast.success("Question submitted!");
      setNewQuestion("");
      fetchQuestions();
    }
    setSubmitting(false);
  };

  const answerQuestion = async (qId: string, answer: string) => {
    const { error } = await supabase.from("mentor_questions").update({
      answer,
      answered_at: new Date().toISOString(),
      mentor_id: user!.id,
    }).eq("id", qId);
    if (error) toast.error("Failed to submit answer");
    else { toast.success("Answer submitted!"); fetchQuestions(); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Ask a Mentor</h1>
          <p className="text-muted-foreground">
            {userRole === "mentor" ? "Answer student questions" : "Submit your career questions and get expert advice"}
          </p>
        </div>

        {userRole === "student" && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <Textarea
                placeholder="Type your career question here..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={3}
              />
              <Button onClick={submitQuestion} disabled={submitting || !newQuestion.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Submitting..." : "Submit Question"}
              </Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No questions yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="font-medium">{q.question}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(q.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {q.answer ? (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-primary mb-1">Mentor Response</p>
                        <p className="text-sm">{q.answer}</p>
                      </div>
                    ) : userRole === "mentor" ? (
                      <AnswerForm onSubmit={(answer) => answerQuestion(q.id, answer)} />
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Awaiting mentor response...</p>
                    )}
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

function AnswerForm({ onSubmit }: { onSubmit: (answer: string) => void }) {
  const [answer, setAnswer] = useState("");
  return (
    <div className="space-y-2">
      <Textarea placeholder="Type your answer..." value={answer} onChange={(e) => setAnswer(e.target.value)} rows={2} />
      <Button size="sm" onClick={() => { onSubmit(answer); setAnswer(""); }} disabled={!answer.trim()}>
        Reply
      </Button>
    </div>
  );
}
