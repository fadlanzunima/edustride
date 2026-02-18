"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Timer, 
  Trophy,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Demo quiz data (will be replaced with API data)
const demoQuiz = {
  id: "1",
  title: "JavaScript Fundamentals Quiz",
  description: "Test your knowledge of JavaScript basics",
  difficulty: "INTERMEDIATE" as const,
  timeLimit: 10, // minutes
  passingScore: 70,
  questions: [
    {
      id: "q1",
      question: "What is the correct way to declare a variable in modern JavaScript?",
      type: "MULTIPLE_CHOICE" as const,
      points: 1,
      options: [
        { text: "var myVar", value: "a" },
        { text: "let myVar", value: "b" },
        { text: "variable myVar", value: "c" },
        { text: "dim myVar", value: "d" },
      ],
      correctAnswer: "b",
      explanation: "In modern JavaScript, 'let' and 'const' are preferred over 'var' for declaring variables.",
    },
    {
      id: "q2",
      question: "Which method is used to add an element to the end of an array?",
      type: "MULTIPLE_CHOICE" as const,
      points: 1,
      options: [
        { text: "push()", value: "a" },
        { text: "pop()", value: "b" },
        { text: "shift()", value: "c" },
        { text: "unshift()", value: "d" },
      ],
      correctAnswer: "a",
      explanation: "The push() method adds one or more elements to the end of an array.",
    },
    {
      id: "q3",
      question: "What does JSON stand for?",
      type: "MULTIPLE_CHOICE" as const,
      points: 1,
      options: [
        { text: "JavaScript Object Notation", value: "a" },
        { text: "Java Standard Object Notation", value: "b" },
        { text: "JavaScript Oriented Network", value: "c" },
        { text: "Java Source Open Network", value: "d" },
      ],
      correctAnswer: "a",
      explanation: "JSON stands for JavaScript Object Notation, a lightweight data-interchange format.",
    },
  ],
};

interface QuizTakerProps {
  onComplete?: (score: number, passed: boolean) => void;
}

export function QuizTaker({ onComplete }: QuizTakerProps) {
  const t = useTranslations("quiz");
  const [started, setStarted] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = React.useState(demoQuiz.timeLimit * 60);
  const [completed, setCompleted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [passed, setPassed] = React.useState(false);

  // Timer
  React.useEffect(() => {
    if (!started || completed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, completed]);

  const handleStart = () => {
    setStarted(true);
    setTimeLeft(demoQuiz.timeLimit * 60);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < demoQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    demoQuiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / demoQuiz.questions.length) * 100);
    const isPassed = calculatedScore >= demoQuiz.passingScore;

    setScore(calculatedScore);
    setPassed(isPassed);
    setCompleted(true);
    onComplete?.(calculatedScore, isPassed);
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setCompleted(false);
    setScore(0);
    setPassed(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((currentQuestion + 1) / demoQuiz.questions.length) * 100;
  const currentQ = demoQuiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  // Start Screen
  if (!started && !completed) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle>{demoQuiz.title}</CardTitle>
          </div>
          <CardDescription>{demoQuiz.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <Timer className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{demoQuiz.timeLimit} min</div>
                <div className="text-xs text-muted-foreground">{t("timeLimit")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{demoQuiz.passingScore}%</div>
                <div className="text-xs text-muted-foreground">{t("passingScore")}</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm font-medium mb-2">{t("instructions")}:</div>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t("instruction1")}</li>
              <li>{t("instruction2")}</li>
              <li>{t("instruction3")}</li>
            </ul>
          </div>

          <Button onClick={handleStart} className="w-full" size="lg">
            {t("startQuiz")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Results Screen
  if (completed) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {passed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <CardTitle>
              {passed ? t("passed") : t("failed")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <div className="text-sm text-muted-foreground">
              {t("scoreDescription", { score, total: demoQuiz.questions.length })}
            </div>
          </div>

          <Progress value={score} className="h-3" />

          <Alert variant={passed ? "default" : "destructive"}>
            {passed ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {passed ? t("congratulations") : t("keepLearning")}
            </AlertTitle>
            <AlertDescription>
              {passed 
                ? t("passedMessage") 
                : t("failedMessage", { passingScore: demoQuiz.passingScore })}
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={handleRestart} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("retake")}
            </Button>
            <Button onClick={() => {}} className="flex-1">
              {t("continue")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz Question Screen
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {t("question")} {currentQuestion + 1} / {demoQuiz.questions.length}
            </CardTitle>
            <CardDescription>{demoQuiz.title}</CardDescription>
          </div>
          <div className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-1.5",
            timeLeft < 60 && "border-red-500 bg-red-50 text-red-600"
          )}>
            <Timer className="h-4 w-4" />
            <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary">
              {t(`type.${currentQ.type.toLowerCase()}`)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentQ.points} {t("points")}
            </span>
          </div>
          <p className="text-base font-medium">{currentQ.question}</p>
        </div>

        <RadioGroup
          value={answers[currentQ.id]}
          onValueChange={(value) => handleAnswer(currentQ.id, value)}
          className="space-y-3"
        >
          {currentQ.options?.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent cursor-pointer"
              onClick={() => handleAnswer(currentQ.id, option.value)}
            >
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="mt-0.5"
              />
              <Label
                htmlFor={option.value}
                className="flex-1 cursor-pointer font-normal"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
          >
            {t("previous")}
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={handleNext}
              disabled={!answers[currentQ.id] || currentQuestion === demoQuiz.questions.length - 1}
            >
              {t("next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={answeredCount < demoQuiz.questions.length}
              variant="default"
            >
              {t("submit")}
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
