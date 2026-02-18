"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Brain, Plus, Search, Filter, Trophy, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuizzes, useQuizStats } from "@/hooks/use-quizzes";
import { cn } from "@/lib/utils";

const difficultyColors = {
  BEGINNER: "bg-green-500",
  INTERMEDIATE: "bg-blue-500",
  ADVANCED: "bg-orange-500",
  EXPERT: "bg-purple-500",
};

const categoryIcons = {
  TECHNICAL: Brain,
  SOFT_SKILL: TrendingUp,
  LANGUAGE: Clock,
  TOOL: Brain,
  DOMAIN_KNOWLEDGE: Trophy,
};

export default function QuizPage() {
  const t = useTranslations("quiz");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [difficulty, setDifficulty] = React.useState<string>("all");

  const { data: quizzesData, isLoading } = useQuizzes({
    search: search || undefined,
    category: category !== "all" ? (category as any) : undefined,
    difficulty: difficulty !== "all" ? (difficulty as any) : undefined,
  });

  const { data: stats } = useQuizStats();

  const quizzes = quizzesData?.data || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/quiz/create">
            <Plus className="mr-2 h-4 w-4" />
            {t("createQuiz")}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalQuizzes")}</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalAttempts")}</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAttempts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("passRate")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("filterCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            <SelectItem value="TECHNICAL">{t("technical")}</SelectItem>
            <SelectItem value="SOFT_SKILL">{t("softSkill")}</SelectItem>
            <SelectItem value="LANGUAGE">{t("language")}</SelectItem>
            <SelectItem value="TOOL">{t("tool")}</SelectItem>
            <SelectItem value="DOMAIN_KNOWLEDGE">{t("domainKnowledge")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("filterDifficulty")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allLevels")}</SelectItem>
            <SelectItem value="BEGINNER">{t("beginner")}</SelectItem>
            <SelectItem value="INTERMEDIATE">{t("intermediate")}</SelectItem>
            <SelectItem value="ADVANCED">{t("advanced")}</SelectItem>
            <SelectItem value="EXPERT">{t("expert")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t("allQuizzes")}</TabsTrigger>
          <TabsTrigger value="beginner">{t("beginner")}</TabsTrigger>
          <TabsTrigger value="intermediate">{t("intermediate")}</TabsTrigger>
          <TabsTrigger value="advanced">{t("advanced")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <QuizSkeleton />
          ) : quizzes.length === 0 ? (
            <EmptyState t={t} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} t={t} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="beginner" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes
              .filter((q) => q.difficulty === "BEGINNER")
              .map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} t={t} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes
              .filter((q) => q.difficulty === "INTERMEDIATE")
              .map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} t={t} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes
              .filter((q) => q.difficulty === "ADVANCED" || q.difficulty === "EXPERT")
              .map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} t={t} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuizCard({ quiz, t }: { quiz: any; t: any }) {
  const Icon = categoryIcons[quiz.category as keyof typeof categoryIcons] || Brain;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base line-clamp-1">{quiz.title}</CardTitle>
              <CardDescription className="text-xs">
                {quiz.skill?.name || t("generalQuiz")}
              </CardDescription>
            </div>
          </div>
          <Badge className={cn("text-xs", difficultyColors[quiz.difficulty as keyof typeof difficultyColors])}>
            {t(`difficulty.${quiz.difficulty.toLowerCase()}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {quiz.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            <span>{quiz._count?.questions || 0} {t("questions")}</span>
          </div>
          {quiz.timeLimit && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{quiz.timeLimit} {t("minutes")}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            <span>{quiz.passingScore}%</span>
          </div>
        </div>
        <Button asChild className="w-full" size="sm">
          <Link href={`/dashboard/quiz/${quiz.id}`}>
            {t("startQuiz")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function QuizSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
            <div className="h-8 w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ t }: { t: any }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Brain className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t("noQuizzes")}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t("noQuizzesDescription")}</p>
        <Button asChild>
          <Link href="/dashboard/quiz/create">
            <Plus className="mr-2 h-4 w-4" />
            {t("createQuiz")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
