"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Eye,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  FileText,
  Award,
  Briefcase,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Sample portfolio data
const portfolioData = {
  profile: {
    name: "Ahmad Rizky",
    title: "Full Stack Developer",
    bio: "Passionate developer with 3+ years experience in React, Node.js, and cloud technologies. Looking for internship opportunities.",
    avatar: "",
    location: "Jakarta, Indonesia",
    education: "Universitas Indonesia - Computer Science (2023-2027)",
  },
  stats: {
    views: 1234,
    connections: 156,
    endorsements: 42,
    profileStrength: 85,
  },
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce with Next.js, Stripe, and PostgreSQL",
      tech: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
      stars: 24,
      forks: 8,
      image: "",
    },
    {
      id: 2,
      title: "AI Task Manager",
      description: "Smart task management with AI-powered prioritization",
      tech: ["React", "Python", "OpenAI", "FastAPI"],
      stars: 18,
      forks: 5,
      image: "",
    },
    {
      id: 3,
      title: "Mobile Banking App",
      description: "UI/UX design for a modern mobile banking application",
      tech: ["Figma", "UI/UX", "Prototyping"],
      stars: 32,
      forks: 12,
      image: "",
    },
  ],
  skills: [
    { name: "React", level: 90, endorsements: 15 },
    { name: "TypeScript", level: 85, endorsements: 12 },
    { name: "Node.js", level: 80, endorsements: 10 },
    { name: "Python", level: 75, endorsements: 8 },
    { name: "UI/UX Design", level: 70, endorsements: 6 },
  ],
  certificates: [
    {
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "Jan 2026",
    },
    { name: "Google Data Analytics", issuer: "Google", date: "Dec 2025" },
    { name: "Meta Frontend Developer", issuer: "Meta", date: "Nov 2025" },
  ],
  experience: [
    {
      role: "Frontend Developer Intern",
      company: "Tokopedia",
      duration: "Jun 2025 - Aug 2025",
      description:
        "Developed new features for the seller dashboard using React",
    },
  ],
};

export function PortfolioPreviewWidget() {
  const [copied, setCopied] = React.useState(false);
  const [activeView, setActiveView] = React.useState<"public" | "recruiter">(
    "public"
  );

  const copyLink = () => {
    navigator.clipboard.writeText("https://edustride.id/portfolio/ahmadrizky");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Live Portfolio Preview</CardTitle>
              <p className="text-xs text-muted-foreground">
                Lihat portofoliomu seperti yang dilihat recruiter
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="gap-1"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveView("public")}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              activeView === "public"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Public View
          </button>
          <button
            onClick={() => setActiveView("recruiter")}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              activeView === "recruiter"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Recruiter View
          </button>
        </div>

        {/* Mini Portfolio Preview */}
        <div className="border rounded-xl overflow-hidden bg-background">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-start gap-3">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarImage src={portfolioData.profile.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-lg">
                  {portfolioData.profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">
                  {portfolioData.profile.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {portfolioData.profile.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0 text-xs"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {portfolioData.profile.location}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0 text-xs"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {portfolioData.stats.profileStrength}% Profile
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 border-b">
            <div className="p-3 text-center border-r">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Eye className="h-3 w-3" />
                <span className="text-xs">Views</span>
              </div>
              <p className="font-semibold">
                {portfolioData.stats.views.toLocaleString()}
              </p>
            </div>
            <div className="p-3 text-center border-r">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Users className="h-3 w-3" />
                <span className="text-xs">Network</span>
              </div>
              <p className="font-semibold">{portfolioData.stats.connections}</p>
            </div>
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Star className="h-3 w-3" />
                <span className="text-xs">Endorse</span>
              </div>
              <p className="font-semibold">
                {portfolioData.stats.endorsements}
              </p>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="w-full rounded-none border-b bg-transparent h-auto p-0">
              <TabsTrigger
                value="projects"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <FileText className="h-4 w-4 mr-1" />
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Award className="h-4 w-4 mr-1" />
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="certs"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Briefcase className="h-4 w-4 mr-1" />
                Certs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="m-0 p-4 space-y-3">
              {portfolioData.projects.slice(0, 2).map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-3 rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3" />
                        {project.stars}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Github className="h-3 w-3" />
                        {project.forks}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 3).map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View All {portfolioData.projects.length} Projects
              </Button>
            </TabsContent>

            <TabsContent value="skills" className="m-0 p-4 space-y-3">
              {portfolioData.skills.slice(0, 4).map((skill, idx) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {skill.endorsements} endorsements
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="certs" className="m-0 p-4 space-y-2">
              {portfolioData.certificates.map((cert, idx) => (
                <div
                  key={cert.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {cert.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer} • {cert.date}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-lg font-bold">+23%</p>
            <p className="text-xs text-muted-foreground">Profile Views</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <Star className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-bold">Top 10%</p>
            <p className="text-xs text-muted-foreground">Your Category</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
