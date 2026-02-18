"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card as CardComponent,
  CardContent as CardContentComponent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useCreateQuiz } from "@/hooks/use-quizzes";
import { useSkills } from "@/hooks/use-skills";
import { toast } from "sonner";

interface Question {
  question: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  points: number;
  options: { text: string; isCorrect: boolean }[];
  correctAnswer: string;
  explanation?: string;
}

export default function CreateQuizPage() {
  const t = useTranslations("quizCreate");
  const router = useRouter();
  const createQuiz = useCreateQuiz();
  const { data: skillsData } = useSkills({ limit: 100 });

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("TECHNICAL");
  const [difficulty, setDifficulty] = React.useState("INTERMEDIATE");
  const [timeLimit, setTimeLimit] = React.useState<string>("");
  const [passingScore, setPassingScore] = React.useState("70");
  const [skillId, setSkillId] = React.useState<string>("");
  const [questions, setQuestions] = React.useState<Question[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error(t("errors.titleRequired"));
      return;
    }

    if (questions.length === 0) {
      toast.error(t("errors.atLeastOneQuestion"));
      return;
    }

    try {
      await createQuiz.mutateAsync({
        title,
        description: description || undefined,
        category: category as any,
        difficulty: difficulty as any,
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        passingScore: parseInt(passingScore),
        skillId: skillId || null,
        questions: questions.map((q) => ({
          ...q,
          type: q.type as any,
        })),
      });

      toast.success(t("success"));
      router.push("/dashboard/quiz");
    } catch (error) {
      toast.error(t("errors.failed"));
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "MULTIPLE_CHOICE",
        points: 1,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: true },
        ],
        correctAnswer: "",
      },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };

    // Auto-update correctAnswer for multiple choice
    if (updates.options) {
      const correctOption = updates.options.find((o) => o.isCorrect);
      if (correctOption) {
        newQuestions[index].correctAnswer = correctOption.text;
      }
    }

    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const newQuestions = [...questions];
    const option = newQuestions[questionIndex].options[optionIndex];

    if (field === "isCorrect" && value === true) {
      // Only one correct answer
      newQuestions[questionIndex].options.forEach((o) => (o.isCorrect = false));
      option.isCorrect = true;
      newQuestions[questionIndex].correctAnswer = option.text;
    } else {
      option[field] = value as any;
    }

    setQuestions(newQuestions);
  };

  const skills = skillsData?.data || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          {t("cancel")}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <CardComponent>
          <CardHeader>
            <CardTitle>{t("basicInfo")}</CardTitle>
            <CardDescription>{t("basicInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t("titleLabel")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">{t("descriptionLabel")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">{t("category")}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNICAL">{t("technical")}</SelectItem>
                    <SelectItem value="SOFT_SKILL">{t("softSkill")}</SelectItem>
                    <SelectItem value="LANGUAGE">{t("language")}</SelectItem>
                    <SelectItem value="TOOL">{t("tool")}</SelectItem>
                    <SelectItem value="DOMAIN_KNOWLEDGE">{t("domainKnowledge")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="difficulty">{t("difficulty")}</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">{t("beginner")}</SelectItem>
                    <SelectItem value="INTERMEDIATE">{t("intermediate")}</SelectItem>
                    <SelectItem value="ADVANCED">{t("advanced")}</SelectItem>
                    <SelectItem value="EXPERT">{t("expert")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="timeLimit">{t("timeLimit")}</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  placeholder={t("timeLimitPlaceholder")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="passingScore">{t("passingScore")}</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skill">{t("linkedSkill")}</Label>
              <Select value={skillId || "none"} onValueChange={(v) => setSkillId(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectSkill")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("noLinkedSkill")}</SelectItem>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </CardComponent>

        {/* Questions */}
        <CardComponent>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("questions")}</CardTitle>
                <CardDescription>{t("questionsDescription")}</CardDescription>
              </div>
              <Button type="button" onClick={addQuestion} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("addQuestion")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t("noQuestions")}
              </div>
            ) : (
              questions.map((question, qIndex) => (
                <Card key={qIndex} className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid gap-2">
                      <Label>{t("questionLabel")} {qIndex + 1}</Label>
                      <Input
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(qIndex, { question: e.target.value })
                        }
                        placeholder={t("questionPlaceholder")}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>{t("questionType")}</Label>
                        <Select
                          value={question.type}
                          onValueChange={(v: any) =>
                            updateQuestion(qIndex, { type: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MULTIPLE_CHOICE">
                              {t("multipleChoice")}
                            </SelectItem>
                            <SelectItem value="TRUE_FALSE">
                              {t("trueFalse")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>{t("points")}</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) =>
                            updateQuestion(qIndex, {
                              points: parseInt(e.target.value) || 1,
                            })
                          }
                          min="1"
                        />
                      </div>
                    </div>

                    {question.type === "MULTIPLE_CHOICE" && (
                      <div className="space-y-2">
                        <Label>{t("options")}</Label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <Switch
                              checked={option.isCorrect}
                              onCheckedChange={(v) =>
                                updateOption(qIndex, oIndex, "isCorrect", v)
                              }
                            />
                            <Input
                              value={option.text}
                              onChange={(e) =>
                                updateOption(qIndex, oIndex, "text", e.target.value)
                              }
                              placeholder={t("optionPlaceholder")}
                              className="flex-1"
                            />
                            {question.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(qIndex, oIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(qIndex)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t("addOption")}
                        </Button>
                      </div>
                    )}

                    {question.type === "TRUE_FALSE" && (
                      <div className="text-sm text-muted-foreground">
                        {t("trueFalseHint")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </CardComponent>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={createQuiz.isPending}>
            {createQuiz.isPending ? t("creating") : t("createQuiz")}
          </Button>
        </div>
      </form>
    </div>
  );
}
