import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EducationStage, calculateDynamicResults, QuizQuestion, stageQuestions, formatCategoryName } from "@/lib/quiz-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, GraduationCap, Briefcase, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Quiz() {
  const [stage, setStage] = useState<EducationStage | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [history, setHistory] = useState<{question: string, answer: string}[]>([]);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [topInterest, setTopInterest] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const progress = stage ? (Math.min(currentQ, 9) / 10) * 100 : 0;
  const allAnswered = stage ? Object.keys(answers).length === 10 : false;

  const fetchNextQuestion = async (currentHistory: {question: string, answer: string}[], baseQuestions: QuizQuestion[]) => {
    setLoadingQuestion(true);
    setCurrentQ(baseQuestions.length);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not configured in .env");

      const systemPrompt = `You are a career counselor designing an adaptive psychometric and career interest test for an Indian student. 
The student's education stage is: ${stage}.
Generate ONE multiple-choice question to determine their career interests. The question must be adaptive and logically follow their previous answers (if any).
IMPORTANT: Keep the question very short (1-2 sentences maximum). Keep each option text very short (1 line maximum).
Return ONLY a valid JSON object in this exact format, with no markdown formatting or backticks:
{
  "question": "The short question text here?",
  "options": [
    { "label": "Short option 1 text", "value": "opt1", "categories": ["engineering", "it_software"] },
    { "label": "Short option 2 text", "value": "opt2", "categories": ["medical"] },
    { "label": "Short option 3 text", "value": "opt3", "categories": ["management"] },
    { "label": "Short option 4 text", "value": "opt4", "categories": ["skill_based"] }
  ]
}
Valid categories are ONLY: engineering, medical, management, civil_services, defense, it_software, diploma, skill_based. Assign 1 to 3 relevant categories to each option. Provide exactly 4 options.`;

      let historyText = "No previous questions.";
      if (currentHistory && currentHistory.length > 0) {
        historyText = currentHistory.map((h, i) => `Q${i+1}: ${h.question}\nAnswer: ${h.answer}`).join("\n\n");
      }
      const userPrompt = `Previous Q&A History:\n${historyText}\n\nGenerate the next question (Question ${currentHistory ? currentHistory.length + 1 : 1} of 10). Respond ONLY with the raw JSON object, no markdown blocks.`;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }]
      });
      
      let resultStr = result.response.text();
      console.log("Raw AI response:", resultStr);

      // Extract JSON using regex if there's surrounding text
      const jsonMatch = resultStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resultStr = jsonMatch[0];
      }
      
      const resultJson = JSON.parse(resultStr.trim());
      
      const newQuestion: QuizQuestion = {
        id: baseQuestions.length + 1,
        question: resultJson.question,
        options: resultJson.options
      };
      
      setQuestions([...baseQuestions, newQuestion]);
    } catch (err) {
      console.error("Failed to fetch next question", err);
      toast.error("Failed to generate question. Please try again.");
      setCurrentQ(Math.max(0, baseQuestions.length - 1));
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    if (stage) {
      setQuestions(stageQuestions[stage]);
      setCurrentQ(0);
      setAnswers({});
      setHistory([]);
      setShowTransition(false);
    }
  }, [stage]);

  const selectAnswer = (value: string) => {
    const question = questions[currentQ];
    if (question) {
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQ];
    const selectedAnswer = answers[currentQuestion.id];
    const selectedOption = currentQuestion.options.find(o => o.value === selectedAnswer);
    
    // Update history up to currentQ
    const slicedHistory = history.slice(0, currentQ);
    const newHistoryEntry = {
      question: currentQuestion.question,
      answer: selectedOption?.label || selectedAnswer
    };
    const newHistory = [...slicedHistory, newHistoryEntry];
    setHistory(newHistory);

    // If we are moving within the first 5 fixed questions (Q1 to Q4)
    if (currentQ < 4) {
      setCurrentQ(currentQ + 1);
      return;
    }

    if (currentQ === 4 && !showTransition) {
      const results = calculateDynamicResults(answers, stage!, stageQuestions[stage!]);
      if (results.length > 0) {
        setTopInterest(formatCategoryName(results[0].category));
      }
      setShowTransition(true);
      setCurrentQ(5);
      return;
    }
    
    // Adaptive phase: slice questions and fetch next
    const slicedQuestions = questions.slice(0, currentQ + 1);
    setQuestions(slicedQuestions);
    
    if (slicedQuestions.length < 10) {
      fetchNextQuestion(newHistory, slicedQuestions);
    } else {
      setCurrentQ(slicedQuestions.length); // go to submit screen if 10 questions done
    }
  };

  const submit = async () => {
    if (!stage) return;
    setSubmitting(true);
    const results = calculateDynamicResults(answers, stage, questions);
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

  const question = questions[currentQ];

  // Quiz Interface
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Career Interest Quiz</h1>
            <p className="text-muted-foreground mt-1">
              Answer 10 questions to discover your ideal path
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {
            setStage(null);
            setQuestions([]);
            setHistory([]);
            setAnswers({});
            setCurrentQ(0);
          }} className="text-muted-foreground">
            Change Stage
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span>Question {Math.min(currentQ + 1, 10)} of 10</span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {loadingQuestion && currentQ >= questions.length ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h2 className="text-xl font-semibold">Generating adaptive question...</h2>
              <p className="text-muted-foreground mt-2 text-center max-w-sm">
                Our AI is analyzing your previous answers to tailor the next question specifically for you.
              </p>
            </motion.div>
          ) : showTransition ? (
            <motion.div
              key="transition"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Perfect!</h2>
              <p className="text-xl text-muted-foreground mb-2">
                Now we know about your interest in <span className="font-semibold text-foreground">{topInterest}</span>.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Let's now talk about your interests in more detail.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setShowTransition(false);
                    setCurrentQ(4);
                  }} 
                  className="w-32"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button 
                  size="lg"
                  onClick={() => {
                    setShowTransition(false);
                    fetchNextQuestion(history, questions.slice(0, 5));
                  }} 
                  className="w-40"
                >
                  Continue <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ) : question && currentQ < 10 ? (
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
          ) : currentQ >= 10 ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                You've successfully answered all the questions. Our AI is ready to analyze your profile and provide personalized career recommendations.
              </p>
              <Button 
                size="lg"
                onClick={submit} 
                disabled={submitting}
                className="px-8"
              >
                {submitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" /> Get My Results</>
                )}
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {currentQ < 10 && !loadingQuestion && question && (
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

            <Button 
              size="lg"
              onClick={handleNext} 
              disabled={!answers[question.id]}
              className="w-32"
            >
              Next <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
