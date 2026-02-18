"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuiz, useSubmitQuiz } from "@/hooks/use-quizzes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Answer {
  questionId: string;
  answer: string;
}

export default function TakeQuizPage() {
  const t = useTranslations("quizTake");
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const { data: quiz, isLoading, error } = useQuiz(quizId);
  const submitQuiz = useSubmitQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  React.useEffect(() => {
    if (quiz?.timeLimit && !timeRemaining) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert to seconds
    }

    if (quiz?.timeLimit && timeRemaining && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            handleSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz?.timeLimit, timeRemaining]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === currentQuestion.id);
      if (existing >= 0) {
        const newAnswers = [...prev];
        newAnswers[existing] = { questionId: currentQuestion.id, answer };
        return newAnswers;
      }
      return [...prev, { questionId: currentQuestion.id, answer }];
    });
  };

  const getCurrentAnswer = () => {
    if (!currentQuestion) return "";
    return answers.find((a) => a.questionId === currentQuestion.id)?.answer || "";
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.length < totalQuestions) {
      const confirmed = window.confirm(t("confirmSubmit"));
      if (!confirmed) return;
    }

    setIsSubmitting(true);

    try {
      await submitQuiz.mutateAsync({
        quizId,
        answers,
      });

      toast.success(t("submitted"));
      router.push(`/dashboard/quiz/${quizId}/results`);
    } catch (error) {
      toast.error(t("submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <QuizLoadingSkeleton />;
  }

  if (error || !quiz) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("quizNotFound")}</h3>
          <Button onClick={() => router.push("/dashboard/quiz")}>
            {t("backToQuizzes")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("back")}
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-muted-foreground">{quiz.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {quiz.timeLimit && timeRemaining !== null && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
              timeRemaining < 60 ? "bg-destructive/10 text-destructive" : "bg-muted"
            )}>
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          )}
          <Badge variant="secondary">
            {currentQuestionIndex + 1} / {totalQuestions}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground text-right">
          {Math.round(progress)}% {t("completed")}
        </p>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg">{t("question")} {currentQuestionIndex + 1}</CardTitle>
              <CardDescription>
                {t("points", { points: currentQuestion?.points || 1 })}
              </CardDescription>
            </div>
            <Badge>
              {currentQuestion?.type === "MULTIPLE_CHOICE" ? t("multipleChoice") : t("trueFalse")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <p className="text-lg font-medium">{currentQuestion?.question}</p>

          {/* Answer Options */}
          {currentQuestion?.type === "MULTIPLE_CHOICE" && currentQuestion?.options && (
            <RadioGroup value={getCurrentAnswer()} onValueChange={handleAnswer}>
              <div className="grid gap-3">
                {(currentQuestion.options as any[]).map((option, index) => (
                  <Label
                    key={index}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      getCurrentAnswer() === option.text
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    )}
                  >
                    <RadioGroupItem value={option.text} className="sr-only" />
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      getCurrentAnswer() === option.text
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/50"
                    )}>
                      {getCurrentAnswer() === option.text && (
                        <div className="h-2 w-2 rounded-full bg-background" />
                      )}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          )}

          {currentQuestion?.type === "TRUE_FALSE" && (
            <RadioGroup value={getCurrentAnswer()} onValueChange={handleAnswer}>
              <div className="grid grid-cols-2 gap-4">
                <Label
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-lg border p-6 cursor-pointer transition-colors",
                    getCurrentAnswer() === "true"
                      ? "border-green-500 bg-green-500/10"
                      : "hover:bg-muted"
                  )}
                >
                  <RadioGroupItem value="true" className="sr-only" />
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span className="font-medium">{t("true")}</span>
                </Label>
                <Label
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-lg border p-6 cursor-pointer transition-colors",
                    getCurrentAnswer() === "false"
                      ? "border-red-500 bg-red-500/10"
                      : "hover:bg-muted"
                  )}
                >
                  <RadioGroupItem value="false" className="sr-only" />
                  <XCircle className="h-6 w-6 text-red-500" />
                  <span className="font-medium">{t("false")}</span>
                </Label>
              </div>
            </RadioGroup>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t("previous")}
            </Button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || getCurrentAnswer() === ""}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? t("submitting") : t("submitQuiz")}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("questionNavigator")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const isAnswered = answers.some((a) => a.questionId === questions[index].id);
              const isCurrent = index === currentQuestionIndex;

              return (
                <Button
                  key={index}
                  variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-primary" />
              <span>{t("current")}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-secondary" />
              <span>{t("answered")}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border" />
              <span>{t("unanswered")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuizLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 bg-muted animate-pulse rounded" />
      <div className="h-2 w-full bg-muted animate-pulse rounded" />
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          <div className="grid gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
