import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";

interface Career {
  id: string;
  title: string;
  category: string;
  salary_range_min: number | null;
  salary_range_max: number | null;
  demand_level: string | null;
}

const COLORS = ["hsl(234, 89%, 60%)", "hsl(173, 58%, 39%)", "hsl(0, 84%, 60%)", "hsl(45, 93%, 47%)", "hsl(280, 65%, 60%)"];

export default function Insights() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("careers").select("id, title, category, salary_range_min, salary_range_max, demand_level").order("salary_range_max", { ascending: false });
      setCareers(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const chartData = careers.map((c) => ({
    name: c.title.length > 15 ? c.title.slice(0, 15) + "..." : c.title,
    min: (c.salary_range_min || 0) / 100000,
    max: (c.salary_range_max || 0) / 100000,
  }));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Salary & Job Market Insights</h1>
          <p className="text-muted-foreground">Compare salaries and job demand across careers</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Salary Ranges (₹ Lakhs/year)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tickFormatter={(v) => `₹${v}L`} />
                      <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v: number) => `₹${v}L`} />
                      <Bar dataKey="min" fill="hsl(234, 89%, 60%)" name="Min Salary" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="max" fill="hsl(173, 58%, 39%)" name="Max Salary" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Job Demand Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Career</th>
                        <th className="text-left py-2 font-medium">Category</th>
                        <th className="text-left py-2 font-medium">Salary Range</th>
                        <th className="text-left py-2 font-medium">Demand</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careers.map((c) => (
                        <tr key={c.id} className="border-b last:border-0">
                          <td className="py-2.5 font-medium">{c.title}</td>
                          <td className="py-2.5 capitalize text-muted-foreground">{c.category}</td>
                          <td className="py-2.5 text-muted-foreground">
                            ₹{((c.salary_range_min || 0) / 100000).toFixed(0)}L - ₹{((c.salary_range_max || 0) / 100000).toFixed(0)}L
                          </td>
                          <td className="py-2.5">
                            <Badge variant={c.demand_level === "high" ? "default" : "secondary"}>
                              {c.demand_level}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
