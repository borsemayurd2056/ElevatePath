import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EducationStage, stageQuestions, calculateDynamicResults } from "@/lib/quiz-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, GraduationCap, Briefcase } from "lucide-react";

export default function Quiz() {
  const [stage, setStage] = useState<EducationStage | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const questions = stage ? stageQuestions[stage] : [];
  const question = questions[currentQ];
  const progress = stage ? ((currentQ + 1) / questions.length) * 100 : 0;
  const allAnswered = stage ? Object.keys(answers).length === questions.length : false;

  const selectAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const submit = async () => {
    if (!stage) return;
    setSubmitting(true);
    const results = calculateDynamicResults(answers, stage);
    const { error } = await supabase.from("quiz_responses").insert({
      user_id: user!.id,
      answers,
      results,
      education_stage: stage,
    });
    
    if (error) {
      console.error("Quiz save error:", error);
      toast.error(`Failed to save: ${error.message || "Unknown error"}`);
    } else {
      toast.success("Quiz completed! Generating recommendations...");
      navigate("/results");
    }
    setSubmitting(false);
  };

  // Step 0: Select Education Stage
  if (!stage) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8 text-center py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome to your Career Compass</h1>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              To give you the most accurate and personalized AI recommendations, please tell us where you currently are in your educational journey.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              variant="outline" 
              className="h-40 text-lg flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all rounded-2xl" 
              onClick={() => setStage('after_10th')}
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <span className="font-semibold">After 10th</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-40 text-lg flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all rounded-2xl" 
              onClick={() => setStage('after_12th_science')}
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <span className="font-semibold">After 12th</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-40 text-lg flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all rounded-2xl" 
              onClick={() => setStage('after_graduation')}
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              <span className="font-semibold">Under/Post Graduation</span>
            </Button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // Quiz Interface
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Career Interest Quiz</h1>
            <p className="text-muted-foreground mt-1">
              Answer {questions.length} questions to discover your ideal path
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setStage(null)} className="text-muted-foreground">
            Change Stage
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-2 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-xl font-semibold leading-relaxed">{question.question}</h2>
                <div className="grid gap-4">
                  {question.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectAnswer(opt.value)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                        answers[question.id] === opt.value
                          ? "border-primary bg-primary/5 text-foreground ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40 hover:bg-accent/50 text-foreground"
                      }`}
                    >
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))} 
            disabled={currentQ === 0}
            className="w-32"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Back
          </Button>

          {currentQ < questions.length - 1 ? (
            <Button 
              size="lg"
              onClick={() => setCurrentQ((p) => p + 1)} 
              disabled={!answers[question.id]}
              className="w-32"
            >
              Next <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button 
              size="lg"
              onClick={submit} 
              disabled={!allAnswered || submitting}
              className="px-8"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {submitting ? "Analyzing..." : "Get My Results"}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
