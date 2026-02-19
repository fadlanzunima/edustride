"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  TrendingUp,
  Award,
  Quote,
  FileText,
  Calendar,
  ExternalLink,
  Globe,
  Target,
  Zap,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Sample research data
const researchData = {
  metrics: {
    totalPublications: 8,
    totalCitations: 127,
    hIndex: 5,
    i10Index: 3,
    avgCitationPerPaper: 15.9,
    thisYearCitations: 34,
  },
  publications: [
    {
      id: 1,
      title:
        "Machine Learning Applications in Educational Technology: A Systematic Review",
      journal: "IEEE Access",
      year: 2025,
      citations: 45,
      quartile: "Q1",
      type: "Journal",
      doi: "10.1109/ACCESS.2025.xxxxx",
      abstract:
        "This paper presents a comprehensive systematic review of ML applications in EdTech...",
    },
    {
      id: 2,
      title: "Deep Learning Approaches for Student Performance Prediction",
      journal: "Computers & Education",
      year: 2025,
      citations: 32,
      quartile: "Q1",
      type: "Journal",
      doi: "10.1016/j.compedu.2025.xxxxx",
      abstract:
        "We propose novel deep learning architectures for predicting academic outcomes...",
    },
    {
      id: 3,
      title:
        "NLP Techniques for Automated Essay Scoring in Indonesian Language",
      journal: "Indonesian Journal of Computer Science",
      year: 2024,
      citations: 28,
      quartile: "Q2",
      type: "Journal",
      doi: "10.1234/ijcs.2024.xxxxx",
      abstract:
        "This study explores BERT-based models for automated essay assessment...",
    },
    {
      id: 4,
      title:
        "Gamification in STEM Education: Meta-Analysis of Learning Outcomes",
      conference: "ACM SIGCSE 2025",
      year: 2025,
      citations: 22,
      type: "Conference",
      doi: "10.1145/xxxxxx.xxxxxx",
      abstract:
        "A meta-analysis of 47 studies on gamification effectiveness in STEM...",
    },
  ],
  researchAreas: [
    { name: "Educational Technology", count: 3, percentage: 37.5 },
    { name: "Machine Learning", count: 2, percentage: 25 },
    { name: "NLP", count: 2, percentage: 25 },
    { name: "Data Science", count: 1, percentage: 12.5 },
  ],
  upcoming: [
    {
      title:
        "Under Review: Federated Learning for Privacy-Preserving Education Analytics",
      journal: "Journal of Learning Analytics",
      submitted: "Dec 2025",
      status: "Under Review",
    },
    {
      title: "Draft: Multimodal Learning Analytics Using Transformer Models",
      progress: 75,
      target: "Feb 2026",
    },
  ],
  goals: {
    publicationsTarget: 10,
    citationsTarget: 200,
    hIndexTarget: 8,
  },
};

export function ResearchImpactWidget() {
  const [selectedPaper, setSelectedPaper] = React.useState<number | null>(null);

  const citationProgress =
    (researchData.metrics.totalCitations / researchData.goals.citationsTarget) *
    100;
  const publicationProgress =
    (researchData.metrics.totalPublications /
      researchData.goals.publicationsTarget) *
    100;

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Research Impact Tracker</CardTitle>
              <p className="text-xs text-muted-foreground">
                Pantau publikasi dan dampak risetmu
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-1" />
            Google Scholar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-center gap-1 text-amber-600 mb-1">
              <FileText className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                Publications
              </span>
            </div>
            <p className="text-xl font-bold">
              {researchData.metrics.totalPublications}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Target: {researchData.goals.publicationsTarget}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-1 text-blue-600 mb-1">
              <Quote className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                Citations
              </span>
            </div>
            <p className="text-xl font-bold">
              {researchData.metrics.totalCitations}
            </p>
            <p className="text-[10px] text-green-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />+ 34 this year
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-1 text-purple-600 mb-1">
              <Target className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                h-Index
              </span>
            </div>
            <p className="text-xl font-bold">{researchData.metrics.hIndex}</p>
            <p className="text-[10px] text-muted-foreground">
              Target: {researchData.goals.hIndexTarget}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800"
          >
            <div className="flex items-center gap-1 text-emerald-600 mb-1">
              <Award className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                i10-Index
              </span>
            </div>
            <p className="text-xl font-bold">{researchData.metrics.i10Index}</p>
            <p className="text-[10px] text-muted-foreground">
              Papers with 10+ cites
            </p>
          </motion.div>
        </div>

        {/* Goal Progress */}
        <div className="space-y-3 p-3 rounded-lg bg-muted/50">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Research Goals 2026
          </h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Publications Target</span>
                <span className="font-medium">
                  {researchData.metrics.totalPublications}/
                  {researchData.goals.publicationsTarget}
                </span>
              </div>
              <Progress value={publicationProgress} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Citations Target</span>
                <span className="font-medium">
                  {researchData.metrics.totalCitations}/
                  {researchData.goals.citationsTarget}
                </span>
              </div>
              <Progress value={citationProgress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Publications List */}
        <Tabs defaultValue="publications" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-auto">
            <TabsTrigger value="publications" className="text-xs py-2">
              <FileText className="h-3 w-3 mr-1" />
              Publications
            </TabsTrigger>
            <TabsTrigger value="areas" className="text-xs py-2">
              <Globe className="h-3 w-3 mr-1" />
              Research Areas
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs py-2">
              <Calendar className="h-3 w-3 mr-1" />
              Upcoming
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publications" className="mt-3 space-y-2">
            {researchData.publications.map((pub, idx) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  selectedPaper === pub.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground/25 hover:bg-muted/30"
                )}
                onClick={() =>
                  setSelectedPaper(selectedPaper === pub.id ? null : pub.id)
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 leading-snug">
                      {pub.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {pub.journal || pub.conference}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {pub.year}
                      </span>
                      <Badge
                        variant={
                          pub.quartile === "Q1" ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {pub.quartile || pub.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-600 shrink-0">
                    <Quote className="h-3 w-3" />
                    {pub.citations}
                  </div>
                </div>

                {selectedPaper === pub.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t"
                  >
                    <p className="text-xs text-muted-foreground mb-2">
                      {pub.abstract}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono"
                      >
                        DOI: {pub.doi}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="areas" className="mt-3">
            <div className="space-y-3">
              {researchData.researchAreas.map((area, idx) => (
                <div key={area.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{area.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {area.count} papers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${area.percentage}%` }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className={cn(
                          "h-full rounded-full",
                          idx === 0 && "bg-amber-500",
                          idx === 1 && "bg-blue-500",
                          idx === 2 && "bg-purple-500",
                          idx === 3 && "bg-emerald-500"
                        )}
                      />
                    </div>
                    <span className="text-xs font-medium w-10 text-right">
                      {area.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-3 space-y-2">
            {researchData.upcoming.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-dashed hover:border-solid transition-colors"
              >
                {"status" in item ? (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.journal} • Submitted {item.submitted}
                      </p>
                      <Badge variant="outline" className="mt-2 text-[10px]">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span>{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-1.5" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Target: {item.target}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full text-xs">
              <ChevronRight className="h-4 w-4 mr-1" />
              Add New Paper
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
