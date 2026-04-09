import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Map, TrendingUp, Users, ChevronRight
} from "lucide-react";

const quickLinks = [
  { title: "Take Career Quiz", icon: ClipboardList, url: "/quiz", color: "bg-primary/10 text-primary" },
  { title: "Explore Careers", icon: Map, url: "/careers", color: "bg-accent/10 text-accent" },
  { title: "Salary Insights", icon: TrendingUp, url: "/insights", color: "bg-destructive/10 text-destructive" },
  { title: "Find Mentors", icon: Users, url: "/mentors", color: "bg-primary/10 text-primary" },
];

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Let's find the perfect career path for you.</p>
        </motion.div>

        {/* Quick Links */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div key={link.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(link.url)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${link.color}`}>
                        <link.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-sm">{link.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
