import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PlaySquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const recommendationVideos = [
  {
    id: "1",
    title: "After Class 10th Kya Karen? | Which Stream Is Best After 10th",
    description: "Detailed guidance by Pravin Sir on how to choose the best stream after your 10th exams to set up a strong foundation for your future career.",
    url: "https://www.youtube.com/live/jy5Xo9B5DFc?si=EVIfpioOnOBVFlg1",
    channel: "Vedantu",
    duration: "Live"
  },
  {
    id: "2",
    title: "WHAT TO DO AFTER 12TH? | Career options and best courses and jobs",
    description: "Vaibhav Kadnar explains various career options, the best courses to pursue, and potential job opportunities available after completing 12th grade.",
    url: "https://youtu.be/BvCCLk-R-4w?si=soCNVKQQZPhp5pIh",
    channel: "Vaibhav Kadnar",
    duration: "Video"
  }
];

export default function Recommendations() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Recommendation Links</h1>
          <p className="text-muted-foreground">Curated career guidance videos to help you navigate your professional journey</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recommendationVideos.map((video, i) => (
            <motion.div key={video.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-md transition-all h-full flex flex-col border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                        <PlaySquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg leading-tight">{video.title}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2 text-xs">
                          <span className="font-medium text-foreground/80">{video.channel}</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                  <Button variant="outline" className="w-full mt-2 gap-2" asChild>
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      <PlaySquare className="w-4 h-4" /> Watch Video
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
