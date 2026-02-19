"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Building2,
  Users,
  ChevronRight,
  Sparkles,
  Target,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Career pathways data for SMA students
const careerPathways = [
  {
    id: "stem",
    name: "STEM",
    fullName: "Science, Technology, Engineering & Math",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    description: "Jalur untuk kamu yang suka berpikir logis dan analitis",
    majors: [
      { name: "Teknik Informatika", demand: "Sangat Tinggi", salary: "8-15jt" },
      { name: "Kedokteran", demand: "Tinggi", salary: "10-30jt" },
      { name: "Data Science", demand: "Sangat Tinggi", salary: "12-25jt" },
      { name: "Arsitektur", demand: "Tinggi", salary: "7-20jt" },
    ],
    skills: ["Problem Solving", "Analytical Thinking", "Mathematics"],
    personalityMatch: ["Logis", "Detail-oriented", "Curious"],
  },
  {
    id: "business",
    name: "Bisnis",
    fullName: "Business & Management",
    icon: Briefcase,
    color: "from-orange-500 to-amber-500",
    description: "Jalur untuk kamu yang suka berinteraksi dan memimpin",
    majors: [
      { name: "Manajemen", demand: "Tinggi", salary: "6-20jt" },
      { name: "Akuntansi", demand: "Tinggi", salary: "5-15jt" },
      { name: "Marketing", demand: "Tinggi", salary: "6-18jt" },
      { name: "Entrepreneurship", demand: "Sedang", salary: "Variatif" },
    ],
    skills: ["Leadership", "Communication", "Strategic Thinking"],
    personalityMatch: ["Extrovert", "Ambisius", "Kreatif"],
  },
  {
    id: "social",
    name: "Sosial",
    fullName: "Social Sciences & Humanities",
    icon: Users,
    color: "from-pink-500 to-rose-500",
    description: "Jalur untuk kamu yang peduli pada masyarakat dan seni",
    majors: [
      { name: "Psikologi", demand: "Tinggi", salary: "5-15jt" },
      { name: "Hukum", demand: "Tinggi", salary: "7-50jt" },
      { name: "Ilmu Komunikasi", demand: "Tinggi", salary: "5-15jt" },
      { name: "Desain", demand: "Tinggi", salary: "6-20jt" },
    ],
    skills: ["Empathy", "Communication", "Creativity"],
    personalityMatch: ["Empatik", "Kreatif", "Sosial"],
  },
];

// Quiz questions for career matching
const quizQuestions = [
  {
    id: 1,
    question: "Kegiatan mana yang paling kamu nikmati?",
    options: [
      { text: "Memecahkan puzzle atau masalah logis", type: "stem" },
      { text: "Memimpin tim atau berdiskusi", type: "business" },
      { text: "Membantu teman atau melukis", type: "social" },
    ],
  },
  {
    id: 2,
    question: "Mata pelajaran favoritmu?",
    options: [
      { text: "Matematika & Fisika", type: "stem" },
      { text: "Ekonomi & Bahasa", type: "business" },
      { text: "Sosiologi & Seni", type: "social" },
    ],
  },
  {
    id: 3,
    question: "Cita-cita masa kecilmu?",
    options: [
      { text: "Ilmuwan atau Programmer", type: "stem" },
      { text: "Pengusaha atau Manager", type: "business" },
      { text: "Guru atau Seniman", type: "social" },
    ],
  },
];

export function CareerExplorerWidget() {
  const [activeTab, setActiveTab] = React.useState<
    "explorer" | "quiz" | "result"
  >("explorer");
  const [selectedPathway, setSelectedPathway] = React.useState<string | null>(
    null
  );
  const [quizAnswers, setQuizAnswers] = React.useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [showQuiz, setShowQuiz] = React.useState(false);

  const handleQuizAnswer = (type: string) => {
    const newAnswers = [...quizAnswers, type];
    setQuizAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const counts: Record<string, number> = {};
      newAnswers.forEach((a) => {
        counts[a] = (counts[a] || 0) + 1;
      });
      const result = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
      setSelectedPathway(result || "stem");
      setActiveTab("result");
    }
  };

  const resetQuiz = () => {
    setQuizAnswers([]);
    setCurrentQuestion(0);
    setActiveTab("explorer");
    setSelectedPathway(null);
  };

  const currentPathway = careerPathways.find((p) => p.id === selectedPathway);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Career Explorer</CardTitle>
              <p className="text-xs text-muted-foreground">
                Temukan jurusan & karir yang cocok untukmu
              </p>
            </div>
          </div>
          {!showQuiz && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuiz(true)}
              className="gap-1"
            >
              <Sparkles className="h-4 w-4" />
              Career Quiz
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <AnimatePresence mode="wait">
          {showQuiz && activeTab === "explorer" ? (
            <motion.div
              key="quiz-intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Career Matching Quiz
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Jawab {quizQuestions.length} pertanyaan untuk menemukan jalur
                karir yang paling cocok denganmu
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setActiveTab("quiz")}>Mulai Quiz</Button>
                <Button variant="outline" onClick={() => setShowQuiz(false)}>
                  Batal
                </Button>
              </div>
            </motion.div>
          ) : activeTab === "quiz" ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">
                  Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(
                    ((currentQuestion + 1) / quizQuestions.length) * 100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={((currentQuestion + 1) / quizQuestions.length) * 100}
                className="h-2"
              />

              <div className="py-4">
                <h3 className="text-base font-medium mb-4">
                  {quizQuestions[currentQuestion].question}
                </h3>
                <div className="space-y-2">
                  {quizQuestions[currentQuestion].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuizAnswer(option.type)}
                      className="w-full text-left p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : activeTab === "result" && currentPathway ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div
                  className={cn(
                    "w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br flex items-center justify-center",
                    currentPathway.color
                  )}
                >
                  <currentPathway.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">{currentPathway.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentPathway.fullName}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Jurusan Populer</h4>
                  <div className="grid gap-2">
                    {currentPathway.majors.map((major) => (
                      <div
                        key={major.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm"
                      >
                        <span>{major.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {major.demand}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {major.salary}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentPathway.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetQuiz}
                  className="flex-1"
                >
                  Ulangi Quiz
                </Button>
                <Button size="sm" className="flex-1">
                  Lihat Detail
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="explorer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {careerPathways.map((pathway, idx) => (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <button
                    onClick={() => setSelectedPathway(pathway.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-all duration-200",
                      selectedPathway === pathway.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/25 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg bg-gradient-to-br shrink-0",
                          pathway.color
                        )}
                      >
                        <pathway.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{pathway.name}</h3>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {pathway.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pathway.majors.slice(0, 2).map((m) => (
                            <Badge
                              key={m.name}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {m.name}
                            </Badge>
                          ))}
                          {pathway.majors.length > 2 && (
                            <Badge variant="secondary" className="text-[10px]">
                              +{pathway.majors.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}

              {selectedPathway && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-2"
                >
                  <Button className="w-full">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Lihat Roadmap Lengkap
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
