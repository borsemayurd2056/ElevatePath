import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";
import { ArrowLeft } from "lucide-react";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const isMentor = searchParams.get("role") === "mentor";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: isMentor ? "mentor" : "student" },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email for verification.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Visual layout */}
      <div className="hidden md:flex md:w-1/2 relative bg-muted items-center justify-center overflow-hidden border-r">
        {/* Dynamic Abstract Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-green-500/20" />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Floating Brand Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 p-10 max-w-md mx-auto text-center space-y-6 backdrop-blur-md bg-background/40 border border-white/10 shadow-2xl rounded-3xl"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-background overflow-hidden border-4 border-primary/20 shadow-xl">
            <img src={logoImg} alt="ElevatePath Logo" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-400">
            Join ElevatePath
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {isMentor 
              ? "Guide students according to your qualifications and experience. Earn money through one to one sessions." 
              : "Create an account to start exploring personalized career paths, connecting with experts, and building your future."}
          </p>
        </motion.div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 md:w-1/2 lg:px-20 xl:px-24 relative">
        <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back to Home <ArrowLeft className="h-4 w-4 rotate-180" />
        </Link>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:max-w-md space-y-8"
        >
          <div className="text-center md:text-left">
            <div className="md:hidden mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 overflow-hidden border-2 border-primary/20 shadow-md">
              <img src={logoImg} alt="ElevatePath Logo" className="h-full w-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up today and start discovering your potential.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Label htmlFor="name">Full Name</Label>
              <div className="mt-1">
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength={6}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </motion.div>



            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Button type="submit" className="w-full text-base font-semibold shadow-lg hover:-translate-y-0.5 transition-all mt-2" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </motion.div>
          </form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
