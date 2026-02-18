"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Share2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuiz, useQuizAttempts } from "@/hooks/use-quizzes";
import { cn } from "@/lib/utils";

export default function QuizResultsPage() {
  const t = useTranslations("quizResults");
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const { data: quiz } = useQuiz(quizId);
  const { data: attemptsData } = useQuizAttempts(quizId);

  const [latestAttempt] = attemptsData?.data || [];

  const score = latestAttempt?.score || 0;
  const passed = latestAttempt?.passed || false;
  const totalQuestions = quiz?.questions?.length || 0;
  const correctAnswers = latestAttempt?.questionAnswers?.filter((a) => a.isCorrect).length || 0;

  const getScoreColor = () => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreMessage = () => {
    if (score >= 90) return t("excellent");
    if (score >= 70) return t("good");
    if (score >= 50) return t("fair");
    return t("needsImprovement");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{quiz?.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/quiz/${quizId}`)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t("retake")}
          </Button>
          <Button onClick={() => router.push("/dashboard/quiz")}>
            {t("backToQuizzes")}
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <Card className={cn(
        "border-2",
        passed ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"
      )}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {passed ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500">
                <XCircle className="h-10 w-10 text-white" />
              </div>
            )}
          </div>
          <CardTitle className={cn("text-4xl font-bold", getScoreColor())}>
            {score}%
          </CardTitle>
          <CardDescription className="text-base">
            {getScoreMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{totalQuestions}</p>
              <p className="text-sm text-muted-foreground">{t("totalQuestions")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{correctAnswers}</p>
              <p className="text-sm text-muted-foreground">{t("correct")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{totalQuestions - correctAnswers}</p>
              <p className="text-sm text-muted-foreground">{t("incorrect")}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{t("yourScore")}</span>
              <span className="font-medium">{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span>{t("passingScore")}</span>
              <span className="font-medium">{quiz?.passingScore}%</span>
            </div>
          </div>

          {passed ? (
            <Alert className="mt-6 bg-green-500/10 border-green-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                {t("passedMessage")}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mt-6 bg-red-500/10 border-red-500">
              <XCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                {t("failedMessage", { passingScore: quiz?.passingScore })}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Answer Review */}
      <Card>
        <CardHeader>
          <CardTitle>{t("answerReview")}</CardTitle>
          <CardDescription>{t("answerReviewDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz?.questions?.map((question, index) => {
            const userAnswer = latestAttempt?.questionAnswers?.find(
              (a) => a.questionId === question.id
            );
            const isCorrect = userAnswer?.isCorrect;

            return (
              <div
                key={question.id}
                className={cn(
                  "rounded-lg border p-4",
                  isCorrect ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{t("questionNum", { num: index + 1 })}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {t("points", { points: question.points })}
                    </span>
                  </div>
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <p className="font-medium mb-3">{question.question}</p>

                {question.type === "MULTIPLE_CHOICE" && question.options && (
                  <div className="space-y-2">
                    {(question.options as any[]).map((option, optIndex) => {
                      const isUserAnswer = userAnswer?.answer === option.text;
                      const isCorrectAnswer = option.isCorrect;

                      return (
                        <div
                          key={optIndex}
                          className={cn(
                            "rounded-lg border p-3 text-sm",
                            isCorrectAnswer && "border-green-500 bg-green-500/10",
                            isUserAnswer && !isCorrectAnswer && "border-red-500 bg-red-500/10"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.text}</span>
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && (
                                <Badge variant="secondary" className="bg-green-500 text-white">
                                  {t("correctAnswer")}
                                </Badge>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <Badge variant="secondary" className="bg-red-500 text-white">
                                  {t("yourAnswer")}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === "TRUE_FALSE" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={cn(
                        "rounded-lg border p-3 text-sm text-center",
                        question.correctAnswer === "true" && "border-green-500 bg-green-500/10",
                        userAnswer?.answer === "true" && !isCorrect && "border-red-500 bg-red-500/10"
                      )}
                    >
                      {t("true")}
                      {question.correctAnswer === "true" && (
                        <CheckCircle2 className="h-4 w-4 ml-2 inline text-green-500" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg border p-3 text-sm text-center",
                        question.correctAnswer === "false" && "border-green-500 bg-green-500/10",
                        userAnswer?.answer === "false" && !isCorrect && "border-red-500 bg-red-500/10"
                      )}
                    >
                      {t("false")}
                      {question.correctAnswer === "false" && (
                        <CheckCircle2 className="h-4 w-4 ml-2 inline text-green-500" />
                      )}
                    </div>
                  </div>
                )}

                {question.explanation && (
                  <div className="mt-3 p-3 rounded-lg bg-muted">
                    <p className="text-sm font-medium mb-1">{t("explanation")}</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Attempt History */}
      {attemptsData?.data && attemptsData.data.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("attemptHistory")}</CardTitle>
            <CardDescription>{t("attemptHistoryDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attemptsData.data.slice(0, 5).map((attempt, index) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      attempt.passed ? "bg-green-500" : "bg-red-500"
                    )}>
                      {attempt.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <XCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{t("attemptNum", { num: attemptsData.data.length - index })}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(attempt.completedAt!).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={attempt.passed ? "default" : "secondary"}>
                    {attempt.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
