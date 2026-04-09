import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Map, Users, BarChart3 } from "lucide-react";
import logoImg from "@/assets/logo.png";

const features = [
  { icon: GraduationCap, title: "Career Quiz", desc: "Discover your ideal career with our AI-powered quiz" },
  { icon: Map, title: "Career Explorer", desc: "Browse 50+ career paths across 5 categories" },
  { icon: Users, title: "Mentor Guidance", desc: "Connect with industry experts for personalized advice" },
  { icon: BarChart3, title: "Salary Insights", desc: "Compare salaries and job demand across careers" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b bg-card">
        <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="ElevatePath" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ElevatePath : CareerCompass
            </span>
          </div>
          <div className="flex gap-2">
            <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 md:py-32 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              FIND YOUR PERFECT
              <span className="text-primary"> CAREER</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered career guidance for students after 10th, 12th, Diploma & Graduation.
              Take the quiz, explore careers, and connect with mentors.
            </p>
            <div className="pt-4 flex justify-center">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link to="/signup?role=mentor">
                    <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/5 text-foreground">
                      JOIN US AS A MENTOR
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent align="center" className="w-64 text-sm text-center">
                  Guide students. Be a mentor according to your qualifications.
                </HoverCardContent>
              </HoverCard>
            </div>
          </motion.div>
        </section>

        <section className="py-16 bg-card border-y">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">ELEVATE YOUR FUTURE WITH AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                  <Link 
                    to="/signup" 
                    className="group block text-center space-y-3 p-6 rounded-2xl border bg-card hover:border-green-500 hover:bg-green-500/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
                  >
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-green-500/20">
                      <f.icon className="h-7 w-7 text-primary transition-colors group-hover:text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 text-center px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Discover Your Future?</h2>
            <p className="text-muted-foreground">Join thousands of students who found their dream career with ElevatePath.</p>
            <Link to="/signup">
              <Button size="lg" className="gap-2">Create Free Account <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 ElevatePath. Built to guide your future.</p>
      </footer>
    </div>
  );
}
